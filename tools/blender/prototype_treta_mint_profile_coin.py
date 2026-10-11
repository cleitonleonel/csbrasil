"""Private Saci coin study from the Mint sculpt; never replaces public assets."""
import argparse
import hashlib
import json
import math
import struct
import sys
from pathlib import Path
import bpy
import bmesh
import numpy as np
from mathutils import Matrix, Quaternion, Vector

parser = argparse.ArgumentParser()
parser.add_argument('--source', required=True)
parser.add_argument('--output', required=True)
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
source, out = Path(args.source), Path(args.output)
out.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(source))
sculpt = next(o for o in bpy.context.scene.objects if o.type == 'MESH')
sculpt.data.transform(sculpt.matrix_world.copy()); sculpt.parent = None
sculpt.matrix_world = Matrix.Identity(4)
lo = Vector(tuple(min(v.co[a] for v in sculpt.data.vertices) for a in range(3)))
hi = Vector(tuple(max(v.co[a] for v in sculpt.data.vertices) for a in range(3)))
center, scale = (lo + hi) / 2, 2 / max(hi - lo)
for v in sculpt.data.vertices: v.co = (v.co - center) * scale
# Studio export splits each triangle. Weld positions while retaining loop UVs.
bm = bmesh.new(); bm.from_mesh(sculpt.data)
bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=.00001)
bm.normal_update()
# Mint invents a mirrored head on the reverse: retain the front half only.
bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.calc_center_median().y > -.003], context='FACES')
for v in bm.verts:
    # Original field y=-.0685; compress raised portrait into shallow die relief.
    original_y = v.co.y
    v.co.y = -.060 + (original_y + .0685) * .14 if original_y < -.075 else -.058
bm.normal_update(); bm.to_mesh(sculpt.data); bm.free()
for o in list(bpy.context.scene.objects):
    if o != sculpt: bpy.data.objects.remove(o, do_unlink=True)
parent = bpy.data.objects.new('TRETA_Coin_1', None); bpy.context.collection.objects.link(parent)
sculpt.name = 'Mint_Saci_Shallow_Obverse'; sculpt.parent = parent
gold = sculpt.data.materials[0]; gold.name = 'MintGoldUniform'
shader = gold.node_tree.nodes.get('Principled BSDF')
color_link = next(iter(shader.inputs['Base Color'].links), None)
if color_link and color_link.from_node.type == 'TEX_IMAGE':
    # Preserve die cavities as monochrome shading in the same gold alloy.
    image = color_link.from_node.image
    pixels = np.array(image.pixels[:], dtype=np.float32).reshape(-1, 4)
    gray = pixels[:, :3] @ np.array([.2126, .7152, .0722])
    shade = np.clip(gray / max(.001, np.percentile(gray, 90)), .40, 1)
    linear_rgb = shade[:, None] * np.array([.83, .60, .17])
    pixels[:, :3] = np.where(linear_rgb <= .0031308, linear_rgb * 12.92,
                             1.055 * np.power(linear_rgb, 1/2.4) - .055)
    image.pixels.foreach_set(pixels.ravel()); image.update(); image.pack()
    if max(image.size) > 1024: image.scale(1024, 1024)
    image.pack()
for key in ('Base Color', 'Metallic', 'Roughness'):
    if key != 'Base Color':
        for link in list(shader.inputs[key].links): gold.node_tree.links.remove(link)
shader.inputs['Base Color'].default_value = (.83, .60, .17, 1)
shader.inputs['Metallic'].default_value = 1
shader.inputs['Roughness'].default_value = .37
gold.diffuse_color = (.83, .60, .17, 1)
for node in gold.node_tree.nodes:
    if node.type == 'NORMAL_MAP': node.inputs['Strength'].default_value = .55
    if node.type == 'TEX_IMAGE' and node.image and max(node.image.size) > 1024:
        node.image.scale(1024, 1024); node.image.pack()
plain_gold = gold.copy(); plain_gold.name = 'CleanMintGold'
plain_shader = plain_gold.node_tree.nodes.get('Principled BSDF')
for key in ('Normal', 'Base Color'):
    for link in list(plain_shader.inputs[key].links): plain_gold.node_tree.links.remove(link)

def finish(o, name):
    o.name = name; o.parent = parent; o.data.materials.clear(); o.data.materials.append(plain_gold)
    if o.type == 'MESH':
        for f in o.data.polygons: f.use_smooth = True
    return o

for f in sculpt.data.polygons: f.use_smooth = True
bpy.ops.mesh.primitive_cylinder_add(vertices=192, radius=1, depth=.12, rotation=(math.pi/2, 0, 0))
body = finish(bpy.context.object, 'CleanCoinBody')
bevel = body.modifiers.new('MintEdgeBevel', 'BEVEL'); bevel.width = .004; bevel.segments = 3
bpy.context.view_layer.objects.active = body; bpy.ops.object.modifier_apply(modifier=bevel.name)
# A fine circular rim, separate from the oversized AI edge.
for y in (-.063, .063):
    bpy.ops.mesh.primitive_torus_add(major_segments=192, minor_segments=8, major_radius=.981,
                                   minor_radius=.007, location=(0, y, 0), rotation=(math.pi/2, 0, 0))
    finish(bpy.context.object, 'FineMintRim')
font_path = Path('/System/Library/Fonts/Supplemental/Times New Roman.ttf')
font = bpy.data.fonts.load(str(font_path))
bold = bpy.data.fonts.load('/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf')

def text(label, position, size, rotation, font=font):
    curve = bpy.data.curves.new('MintLegend', 'FONT'); curve.body = label; curve.font = font
    curve.align_x = curve.align_y = 'CENTER'; curve.size = size
    curve.extrude = .010; curve.bevel_depth = .0015; curve.bevel_resolution = 1; curve.resolution_u = 4
    obj = bpy.data.objects.new('GEO-MintLegend', curve); bpy.context.collection.objects.link(obj)
    obj.location = position; obj.rotation_mode = 'QUATERNION'; obj.rotation_quaternion = rotation
    bpy.context.view_layer.objects.active = obj; obj.select_set(True); bpy.ops.object.convert(target='MESH')
    obj.select_set(False); return finish(obj, obj.name)

for label, center_angle, step in [('TRETA$', 0, .205), ('SACI', math.pi, -.18)]:
    for i, char in enumerate(label):
        a = center_angle + (i - (len(label) - 1) / 2) * step
        text(char, (.858 * math.sin(a), -.068, .858 * math.cos(a)), .15,
             Quaternion((0, 1, 0), a + (math.pi if center_angle > 1 else 0)) @ Quaternion((1, 0, 0), math.pi/2))
back_rotation = Quaternion((0, 0, 1), math.pi) @ Quaternion((1, 0, 0), math.pi/2)
text('1', (0, .066, .20), 1.30, back_rotation, bold)
text('T$', (0, .066, -.45), .38, back_rotation, bold)
for mat in (gold, plain_gold):
    objects = [o for o in parent.children_recursive if o.type == 'MESH' and o.data.materials[0] == mat]
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects: obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]; bpy.ops.object.join()
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
# Bake actual surface occlusion for lettering in the shadowless small UI stage.
body = next(o for o in parent.children_recursive if o.data.materials[0] == plain_gold)
bpy.ops.object.select_all(action='DESELECT'); body.select_set(True)
bpy.context.view_layer.objects.active = body
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=.004)
bpy.ops.object.mode_set(mode='OBJECT')
ao_image = bpy.data.images.new('MintGeometryOcclusion', width=1024, height=1024, alpha=True)
ao_image.colorspace_settings.name = 'Non-Color'
ao_node = plain_gold.node_tree.nodes.new('ShaderNodeTexImage'); ao_node.image = ao_image
plain_gold.node_tree.nodes.active = ao_node
bpy.context.scene.render.engine = 'CYCLES'; bpy.context.scene.cycles.samples = 48
bpy.ops.object.bake(type='AO', margin=8)
pixels = np.array(ao_image.pixels[:], dtype=np.float32).reshape(-1, 4)
shade = np.clip(pixels[:, 0], .20, 1)
linear_rgb = shade[:, None] * np.array([.83, .60, .17])
pixels[:, :3] = np.where(linear_rgb <= .0031308, linear_rgb * 12.92,
                         1.055 * np.power(linear_rgb, 1/2.4) - .055)
ao_image.colorspace_settings.name = 'sRGB'; ao_image.pixels.foreach_set(pixels.ravel())
ao_image.update(); ao_image.pack()
plain_gold.node_tree.links.new(ao_node.outputs['Color'], plain_shader.inputs['Base Color'])
# Spin and purchase clips use the same contract as the existing wallet coins.
for frame, angle in [(1, 0), (121, math.tau)]:
    parent.rotation_euler.z = angle; parent.keyframe_insert('rotation_euler', frame=frame)
spin = parent.animation_data.action; spin.name = 'CoinSpin'
for slot in spin.slots:
    for layer in spin.layers:
        for strip in layer.strips:
            bag = strip.channelbag(slot)
            if bag:
                for curve in bag.fcurves:
                    for point in curve.keyframe_points: point.interpolation = 'LINEAR'
parent.animation_data.action = None
for frame, s, angle in [(1, .05, -math.pi), (20, 1.07, -.3), (32, 1, 0), (60, 1, 0)]:
    parent.scale = (s,) * 3; parent.rotation_euler.z = angle
    parent.keyframe_insert('scale', frame=frame); parent.keyframe_insert('rotation_euler', frame=frame)
reveal = parent.animation_data.action; reveal.name = 'PurchaseReveal'; parent.animation_data.action = None
for action in (spin, reveal):
    track = parent.animation_data.nla_tracks.new(); track.name = action.name
    track.strips.new(action.name, int(action.frame_range[0]), action)
scene = bpy.context.scene; scene.render.fps = 30; scene.frame_start = 1; scene.frame_end = 121
for track in parent.animation_data.nla_tracks: track.mute = True
parent.rotation_euler = (0, 0, 0); parent.scale = (1, 1, 1); scene.frame_set(1)
bpy.ops.object.select_all(action='DESELECT')
for obj in [parent] + list(parent.children_recursive): obj.select_set(True)
for track in parent.animation_data.nla_tracks: track.mute = False
glb = out / 'coin-1.glb'
bpy.ops.export_scene.gltf(filepath=str(glb), export_format='GLB', use_selection=True, export_animations=True,
                          export_animation_mode='NLA_TRACKS', export_apply=False, export_lights=False, export_cameras=False)
# Neutral rest transform is essential: the viewer fits before playing a clip.
raw = glb.read_bytes(); length = struct.unpack_from('<I', raw, 12)[0]
document = json.loads(raw[20:20 + length])
node = next(n for n in document['nodes'] if n.get('name') == parent.name)
node['scale'], node['rotation'] = [1, 1, 1], [0, 0, 0, 1]
chunk = json.dumps(document, separators=(',', ':')).encode(); chunk += b' ' * (-len(chunk) % 4)
tail = raw[20 + length:]
glb.write_bytes(struct.pack('<4sII', b'glTF', 2, 20 + len(chunk) + len(tail)) +
                struct.pack('<I4s', len(chunk), b'JSON') + chunk + tail)
for track in parent.animation_data.nla_tracks: track.mute = True
parent.rotation_euler = (0, 0, 0); parent.scale = (1, 1, 1)
bpy.ops.object.camera_add(location=(0, -4.8, 0)); cam = bpy.context.object
cam.data.type = 'ORTHO'; cam.data.ortho_scale = 2.35; scene.camera = cam
scene.world.use_nodes = True; bg = scene.world.node_tree.nodes.get('Background')
bg.inputs['Color'].default_value = (.55, .55, .55, 1); bg.inputs['Strength'].default_value = .45
for pos, energy, size in [((-2,-3,3),320,2.2),((3,-2,0),100,4),((0,-2,-3),80,3),((-2,3,3),320,2.2),((3,2,0),100,4)]:
    bpy.ops.object.light_add(type='AREA', location=pos); obj = bpy.context.object
    obj.data.energy = energy; obj.data.size = size; obj.rotation_euler = (-obj.location).to_track_quat('-Z','Y').to_euler()
scene.render.engine = 'CYCLES'; scene.cycles.samples = 40
scene.render.resolution_x = scene.render.resolution_y = 768; scene.render.resolution_percentage = 100
scene.render.film_transparent = True; scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
for label, pos in [('front',(0,-4.8,0)),('angle',(1.5,-4.8,1.2)),('back',(0,4.8,0)),('edge',(4.8,0,0))]:
    cam.location = pos; cam.rotation_euler = (-cam.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath = str(out/f'saci-{label}.png'); bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(out/'coin-1.blend'))
metadata = {'scope':'private-single-design-study-not-owner-approved','source':str(source),
            'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),
            'glbBytes':glb.stat().st_size,'glbSha256':hashlib.sha256(glb.read_bytes()).hexdigest(),
            'animations':['CoinSpin','PurchaseReveal'],'mintChat':'ph71y8j0aqntbcggsr1bdqm68h8g3apk',
            'changes':['front only','shallow relief','uniform gold','clean reverse and denomination','serif arc'],
            'triangles':sum(len(p.vertices)-2 for o in parent.children_recursive if o.type=='MESH' for p in o.data.polygons)}
(out/'coin-1.json').write_text(json.dumps(metadata,indent=2)); print('MINT_COIN_DONE', json.dumps(metadata))
