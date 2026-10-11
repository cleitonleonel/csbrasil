/* Proxies de movimento permanecem físicos; a bala registra somente superfícies renderizadas. */
const guarded = new WeakSet();
const renders = material => material && material.visible !== false && material.colorWrite !== false && (material.opacity ?? 1) > 0;
const visibleNode = object => {
  for (let node = object; node; node = node.parent) if (node.visible === false) return false;
  return true;
};
export function isVisibleShotObject(object) {
  const materials = Array.isArray(object.material) ? object.material : [object.material];
  return visibleNode(object) && materials.some(renders);
}
export function withVisibleShotOccluders(build) {
  const wrapped = (...args) => {
    const world = build(...args);
    const meshes = [], seen = new Set();
    const include = object => {
      if (!seen.has(object) && isVisibleShotObject(object)) { seen.add(object); meshes.push(object); }
    };
    for (const object of world.occluders) {
      if (object.material) include(object);
      else object.traverse?.(node => { if (node.isMesh) include(node); });
    }
    world.occluders = meshes;
    for (const object of world.occluders) {
      if (guarded.has(object)) continue;
      const raycast = object.raycast;
      object.raycast = function (raycaster, hits) {
        if (!visibleNode(this)) return;
        const start = hits.length; raycast.call(this, raycaster, hits);
        let next = start;
        for (let index = start; index < hits.length; index++) {
          const hit = hits[index];
          const materials = hit.object.material;
          const material = Array.isArray(materials) ? materials[hit.face?.materialIndex ?? 0] : materials;
          if (renders(material)) hits[next++] = hit;
        }
        hits.length = next;
      };
      guarded.add(object);
    }
    return world;
  };
  Object.defineProperty(wrapped, 'name', { value: build.name });
  return wrapped;
}
