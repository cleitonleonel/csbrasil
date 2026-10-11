import argparse
import hashlib
import json
import math
import struct
import sys
from pathlib import Path

import bpy
from mathutils import Vector, Matrix, Quaternion

parser = argparse.ArgumentParser()
parser.add_argument('--root', required=True)
parser.add_argument('--output', required=True)
parser.add_argument('--only')
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
root, output = Path(args.root), Path(args.output)
output.mkdir(parents=True, exist_ok=True)
coins = [(1, 'saci', 'mp5'), (5, 'curupira', 'mp5'), (10, 'caipora', 'scar'),
         (50, 'lobisomem', 'ak'), (100, 'gotinha', 'mp5'), (200, 'canarinho', 'deagle'), (1000, 'zumbi', 'ak')]

def geometry_import(path):
    """Read the existing weapon geometry without importing its WebP materials."""
    raw = path.read_bytes()
    length = struct.unpack_from('<I', raw, 12)[0]
    doc = json.loads(raw[20:20 + length])
    binary = raw[28 + length:]
    def accessor(index):
        a = doc['accessors'][index]; view = doc['bufferViews'][a['bufferView']]
        fmt = {5126:'f',5125:'I',5123:'H',5121:'B'}[a['componentType']]
        n = {'SCALAR':1,'VEC3':3}[a['type']]; size = struct.calcsize(fmt)*n
        offset = view.get('byteOffset',0)+a.get('byteOffset',0)
        stride = view.get('byteStride',size)
        return [struct.unpack_from('<'+fmt*n,binary,offset+i*stride) for i in range(a['count'])]
    def visit(index, parent):
        n = doc['nodes'][index]
        if 'matrix' in n:
            m = Matrix([n['matrix'][i:i+4] for i in range(0,16,4)]).transposed()
        else:
            q = n.get('rotation',[0,0,0,1]); scale = n.get('scale',[1,1,1])
            m = Matrix.Translation(Vector(n.get('translation',[0,0,0]))) @ Quaternion((q[3],*q[:3])).to_matrix().to_4x4() @ Matrix.Diagonal((*scale,1))
        world = parent @ m
        if 'mesh' in n:
            for p in doc['meshes'][n['mesh']]['primitives']:
                if p.get('mode',4)!=4: continue
                vertices = accessor(p['attributes']['POSITION'])
                indices = [x[0] for x in accessor(p['indices'])] if 'indices' in p else list(range(len(vertices)))
                mesh = bpy.data.meshes.new('WeaponRelief')
                mesh.from_pydata(vertices,[],[indices[i:i+3] for i in range(0,len(indices),3)])
                obj = bpy.data.objects.new('WeaponRelief',mesh);bpy.context.collection.objects.link(obj);obj.matrix_world=world
        for child in n.get('children',[]):visit(child,world)
    for index in doc['scenes'][doc.get('scene',0)]['nodes']:
        visit(index,Matrix.Rotation(math.pi/2,4,'X'))


def material(name, color, metallic=1, roughness=.28):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    shader = m.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Metallic'].default_value = metallic
    shader.inputs['Roughness'].default_value = roughness
    return m


def finish(obj, name, mat, parent):
    obj.name = name
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    obj.parent = parent
    if obj.type == 'MESH':
        for face in obj.data.polygons:
            face.use_smooth = True
    return obj


def text(label, pos, size, mat, parent, backside=False):
    curve = bpy.data.curves.new('Inscription', 'FONT')
    curve.body, curve.align_x, curve.align_y = label, 'CENTER', 'CENTER'
    curve.size, curve.extrude, curve.bevel_depth = size, .012, .0015
    obj = bpy.data.objects.new('Letter_' + label, curve)
    bpy.context.collection.objects.link(obj)
    obj.location = pos
    obj.rotation_euler = (math.pi / 2, 0, math.pi if backside else 0)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target='MESH')
    obj.select_set(False)
    finish(obj, 'Legend_' + label, mat, parent)


def import_relief(character, weapon, mat, parent):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(root / f'public/models/characters/{character}.glb'))
    char_objects = set(bpy.data.objects) - before
    rig = next((o for o in char_objects if o.type == 'ARMATURE'), None)
    if rig:
        rig.animation_data_clear()
        # Pose the rest rig directly. Animation-only files use a different node
        # hierarchy; their transforms cannot be copied into Blender bone matrices.
        for side, sign in [('Left', 1), ('Right', -1)]:
            for name, degrees in [(side + 'Arm', 55 * sign), (side + 'ForeArm', -200 * sign)]:
                bone = rig.pose.bones.get(name)
                if bone:
                    pivot = bone.matrix.translation.copy()
                    turn = Matrix.Translation(pivot) @ Matrix.Rotation(math.radians(degrees), 4, 'Y') @ Matrix.Translation(-pivot)
                    bone.matrix = turn @ bone.matrix
                    bpy.context.view_layer.update()
    # Blender creates hidden BoneShape meshes for rig display. They are not
    # character geometry and must never enter the embossed model or its bounds.
    meshes = [o for o in char_objects if o.type == 'MESH' and not o.hide_render and (not rig or any(m.type=='ARMATURE' for m in o.modifiers))]
    baked = []
    for obj in meshes:
        evaluated = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
        obj.data = bpy.data.meshes.new_from_object(evaluated, depsgraph=bpy.context.evaluated_depsgraph_get())
        obj.modifiers.clear()
        matrix = obj.matrix_world.copy()
        obj.parent = None
        obj.matrix_world = matrix
        baked.append(obj)
    bounds = [o.matrix_world @ o.data.vertices[i].co for o in baked for i in {i for p in o.data.polygons for i in p.vertices}]
    lo, hi = [Vector([f(p[i] for p in bounds) for i in range(3)]) for f in (min, max)]
    center = (lo + hi) / 2
    factor = min(1.18 / max(hi.z - lo.z, .01), 1.25 / max(hi.x - lo.x, .01))
    hands = [rig.matrix_world @ rig.pose.bones[name].matrix.translation for name in ['LeftHand', 'RightHand'] if rig and name in rig.pose.bones]
    grip = (sum(hands, Vector()) / len(hands) - center) * factor if hands else Vector((0, 0, .17))
    print('RELIEF_BOUNDS', character, list(lo), list(hi), factor, list(grip))
    head = rig.pose.bones.get("Head") if rig else None
    head_center = rig.matrix_world @ head.matrix.translation - center if head else None
    for obj in baked:
        for vertex in obj.data.vertices:
            p = obj.matrix_world @ vertex.co - center
            if character in ('caipora', 'zumbi', 'canarinho') and head_center is not None:
                weight = max(0, min(1, (p.z - head_center.z + .025 / factor) / (.05 / factor)))
                p += (p - head_center) * .18 * weight
            vertex.co = (p.x * factor, -.18 + p.y * factor * .16, p.z * factor - .05)
        obj.matrix_world.identity()
        finish(obj, 'MintRelief_' + character, mat, parent)
    for obj in char_objects:
        if obj not in baked and obj.name in bpy.data.objects:
            bpy.data.objects.remove(obj, do_unlink=True)
    before_weapon = set(bpy.data.objects)
    # Some weapon node names contain numeric suffixes larger than Blender's
    # importer accepts. Rename only labels in a temporary GLB, preserving buffers.
    raw = (root / f'public/models/weapons/{weapon}.glb').read_bytes()
    length = struct.unpack_from('<I', raw, 12)[0]
    doc = json.loads(raw[20:20 + length])
    for key in ('nodes', 'meshes', 'materials'):
        for i, entry in enumerate(doc.get(key, [])):
            entry['name'] = f'Treta_{key}_{i}'
    chunk = json.dumps(doc, separators=(',', ':')).encode()
    chunk += b' ' * (-len(chunk) % 4)
    tail = raw[20 + length:]
    temporary = output / f'weapon-{weapon}-import.glb'
    temporary.write_bytes(struct.pack('<4sII', b'glTF', 2, 20+len(chunk)+len(tail)) + struct.pack('<I4s', len(chunk), b'JSON') + chunk + tail)
    geometry_import(temporary)
    gun_objects = set(bpy.data.objects) - before_weapon
    gun_meshes = [o for o in gun_objects if o.type == 'MESH']
    gun_points = [o.matrix_world @ Vector(c) for o in gun_meshes for c in o.bound_box]
    gl, gh = [Vector([f(p[i] for p in gun_points) for i in range(3)]) for f in (min, max)]
    gc = (gl + gh) / 2
    longest = max(range(3), key=lambda i: gh[i] - gl[i])
    height_axis = min((i for i in range(3) if i != longest), key=lambda i: abs(i - 2))
    depth_axis = next(i for i in range(3) if i not in (longest, height_axis))
    gun_scale = (.45 if weapon == 'deagle' else .72) / max(gh[longest] - gl[longest], .01)
    for obj in gun_meshes:
        matrix = obj.matrix_world.copy()
        obj.parent = None
        for vertex in obj.data.vertices:
            p = matrix @ vertex.co - gc
            vertex.co = (p[longest] * gun_scale + grip.x, -.23 + p[depth_axis] * gun_scale * .15, p[height_axis] * gun_scale + grip.z - .14)
        obj.matrix_world.identity()
        finish(obj, 'EmbossedWeapon_' + weapon, mat, parent)
    for obj in gun_objects:
        if obj not in gun_meshes and obj.name in bpy.data.objects:
            bpy.data.objects.remove(obj, do_unlink=True)


def build(value, character, weapon):
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for action in list(bpy.data.actions):
        bpy.data.actions.remove(action)
    gold = material('Treta_Gold', (.83, .48, .085), 1, .26)
    bright = material('Treta_MintedRelief', (.98, .72, .25), .92, .33)
    dark = material('Treta_InnerGold', (.34, .16, .025), .92, .35)
    parent = bpy.data.objects.new('TRETA_Coin_' + str(value), None)
    bpy.context.collection.objects.link(parent)
    bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=1, depth=.18, rotation=(math.pi / 2, 0, 0))
    disk = finish(bpy.context.object, 'GoldenBlank', gold, parent)
    bevel = disk.modifiers.new('MintedBevel', 'BEVEL')
    bevel.width, bevel.segments = .024, 3
    bpy.context.view_layer.objects.active = disk
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    for y in (-.098, .098):
        bpy.ops.mesh.primitive_torus_add(major_segments=96, minor_segments=8, major_radius=.926, minor_radius=.028,
                                       location=(0, y, 0), rotation=(math.pi / 2, 0, 0))
        finish(bpy.context.object, 'RaisedRim', bright, parent)
    for i in range(64):
        theta = i * math.tau / 64
        bpy.ops.mesh.primitive_cube_add(size=1, location=(.994 * math.cos(theta), 0, .994 * math.sin(theta)))
        obj = bpy.context.object
        obj.scale, obj.rotation_euler = (.015, .13, .019), (0, -theta, 0)
        finish(obj, 'ReededEdge_' + str(i), dark, parent)
    import_relief(character, weapon, bright, parent)
    if character == 'caipora':
        # Mask and jaguar spots: references/treta-coins/caipora.webp, eyes x95–147/y52–77.
        outline=[(-.058,.423),(-.029,.432),(-.008,.426),(0,.419),(.008,.426),(.029,.432),(.058,.423),(.057,.398),(.027,.39),(.014,.40),(0,.395),(-.014,.40),(-.027,.39),(-.057,.398)]
        mesh=bpy.data.meshes.new('CaiporaMask');mesh.from_pydata([(x,-.223,z) for x,z in outline],[],[list(range(len(outline)))])
        obj=bpy.data.objects.new('CaiporaMask',mesh);bpy.context.collection.objects.link(obj)
        solid=obj.modifiers.new('MaskRelief','SOLIDIFY');solid.thickness=.003
        bpy.context.view_layer.objects.active=obj;bpy.ops.object.modifier_apply(modifier=solid.name)
        finish(obj,'Caipora_ContinuousMask',dark,parent)
        for x in (-.027,.027):
            bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=6,radius=1,location=(x,-.227,.412))
            obj=bpy.context.object;obj.scale=(.013,.003,.006)
            finish(obj,'Caipora_Eyes',gold,parent)
        for k,(x,z) in enumerate([(-.052,.112),(-.025,.084),(.025,.111),(.058,.09),(-.055,.056),(.023,.052)]):
            points=[]
            for j in range(7):
                angle=math.tau*j/7;r=.008*(1+.35*math.sin(j*2.1+k))
                points.append((x+r*math.cos(angle),-.216,z+r*.65*math.sin(angle)))
            mesh=bpy.data.meshes.new('JaguarMark');mesh.from_pydata(points,[],[list(range(7))])
            obj=bpy.data.objects.new('JaguarMark',mesh);bpy.context.collection.objects.link(obj)
            finish(obj,'Caipora_JaguarMark',dark,parent)
    text(str(value), (0, -.13, .72), .29 if value < 1000 else .235, bright, parent)
    text('T$', (0, -.13, -.76), .25, bright, parent)
    text('TRETA$', (0, .13, .16), .34, bright, parent, True)
    text('CORO SOLTO', (0, .13, -.26), .13, bright, parent, True)
    # One static mesh per material keeps a coin from costing ~70 draw calls.
    for mat in (gold, bright, dark):
        meshes = [o for o in parent.children_recursive if o.type == 'MESH' and o.data.materials[0] == mat]
        bpy.ops.object.select_all(action='DESELECT')
        for obj in meshes:
            obj.select_set(True)
        if meshes:
            bpy.context.view_layer.objects.active = meshes[0]
            bpy.ops.object.join()
    parent.rotation_euler = (0, 0, 0)
    for frame, angle in [(1, 0), (121, math.tau)]:
        parent.rotation_euler.z = angle
        parent.keyframe_insert('rotation_euler', frame=frame)
    spin = parent.animation_data.action
    spin.name = 'CoinSpin'
    for slot in spin.slots:
        for layer in spin.layers:
            for strip in layer.strips:
                bag = strip.channelbag(slot)
                if bag:
                    for curve in bag.fcurves:
                        for point in curve.keyframe_points:
                            point.interpolation = 'LINEAR'
    parent.animation_data.action = None
    for frame, scale, angle in [(1, .05, -math.pi), (20, 1.12, -.3), (32, 1, 0), (60, 1, 0)]:
        parent.scale = (scale,) * 3
        parent.rotation_euler.z = angle
        parent.keyframe_insert('scale', frame=frame)
        parent.keyframe_insert('rotation_euler', frame=frame)
    reveal = parent.animation_data.action
    reveal.name = 'PurchaseReveal'
    parent.animation_data.action = None
    for action in (spin, reveal):
        track = parent.animation_data.nla_tracks.new()
        track.name = action.name
        track.strips.new(action.name, int(action.frame_range[0]), action)
        track.mute = False
    scene = bpy.context.scene
    scene.render.fps, scene.frame_start, scene.frame_end = 30, 1, 121
    for track in parent.animation_data.nla_tracks:
        track.mute = True
    parent.rotation_euler, parent.scale = (0, 0, 0), (1, 1, 1)
    scene.frame_set(1)
    asset_objects = [parent] + list(parent.children_recursive)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in asset_objects:
        obj.select_set(True)
    for track in parent.animation_data.nla_tracks:
        track.mute = False
    glb = root / f'public/models/treta/coin-{value}.glb'
    glb.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(glb), export_format='GLB', use_selection=True, export_animations=True,
                              export_animation_mode='NLA_TRACKS', export_apply=False, export_lights=False, export_cameras=False)
    raw = glb.read_bytes(); length = struct.unpack_from('<I', raw, 12)[0]
    doc = json.loads(raw[20:20+length])
    node = next(n for n in doc['nodes'] if n.get('name') == parent.name)
    node['scale'], node['rotation'] = [1,1,1], [0,0,0,1]
    chunk = json.dumps(doc,separators=(',',':')).encode();chunk += b' '*(-len(chunk)%4)
    tail = raw[20+length:]
    glb.write_bytes(struct.pack('<4sII',b'glTF',2,20+len(chunk)+len(tail))+struct.pack('<I4s',len(chunk),b'JSON')+chunk+tail)
    for track in parent.animation_data.nla_tracks:
        track.mute = True
    parent.rotation_euler, parent.scale = (0, 0, 0), (1, 1, 1)
    bpy.ops.object.camera_add(location=(.15, -4.8, .25))
    camera = bpy.context.object
    camera.rotation_euler = (Vector((0, 0, 0)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
    camera.data.type, camera.data.ortho_scale = 'ORTHO', 2.35
    scene.camera = camera
    scene.world.color = (.2, .2, .2)
    for pos, power, size in [((-3, -3, 4), 650, 3), ((3, -2, 1), 500, 2), ((0, 2, 3), 750, 2)]:
        bpy.ops.object.light_add(type='AREA', location=pos)
        light = bpy.context.object
        light.data.energy, light.data.shape, light.data.size = power, 'DISK', size
        light.rotation_euler = (-light.location).to_track_quat('-Z', 'Y').to_euler()
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 16
    scene.render.resolution_x = scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.view_settings.view_transform = 'AgX'
    poster = root / f'public/img/treta/coin-{value}.png'
    poster.parent.mkdir(parents=True, exist_ok=True)
    scene.render.filepath = str(poster)
    bpy.ops.render.render(write_still=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(output / f'coin-{value}.blend'))
    metadata = {'value': value, 'character': character, 'weapon': weapon, 'blender': bpy.app.version_string,
                'glbBytes': glb.stat().st_size, 'glbSha256': hashlib.sha256(glb.read_bytes()).hexdigest(),
                'animations': ['CoinSpin', 'PurchaseReveal'], 'poster': str(poster),
                'source': f'public/models/characters/{character}.glb', 'triangles': sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in asset_objects if o.type == 'MESH')}
    (output / f'coin-{value}.json').write_text(json.dumps(metadata, indent=2))
    print('TRETA_COIN_DONE', json.dumps(metadata))


for denomination, char, gun in coins:
    if not args.only or str(denomination) == args.only:
        build(denomination, char, gun)
