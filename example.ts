import * as THREE from "three";
import { Matrix4 } from "three";
import { Path } from "./src/Akeley";
import { Polyline } from "./src/Polyline";
import { lerp } from "./src/Segment";
import { add, catmullRomPoint, lookAt } from "./src/utils";

function makeInstance(
  geometry: THREE.Geometry,
  color: string | number | THREE.Color,
  x: number = 0,
  y: number = 0,
  z: number = 0
) {
  const material = new THREE.MeshPhongMaterial({ color: color });
  const instance = new THREE.Mesh(geometry, material);
  instance.position.x = x;
  instance.position.y = y;
  instance.position.z = z;

  return instance;
}

function main() {
  // camera path
  /*
  const path = new Path([
    lerp().to(-4, 0, 0).within(2000),
    lerp().to(0, 4, 0),
    lerp().to(0, 0, 4),
  ]);
  */

  /*
  const path = new Path([
    new Polyline()
      .from(1, 1, 1)
      .to(4, 4, 4)
      .between([2, 3, 2], [3, 2, 3])
      .within(8000),
  ]);
  */

  const path = new Path([
    new Polyline()
      .entering(0, 0, 0)
      .between([1, 0, 0], [1, 0, 1], [-1, 0, 1], [-1, 0, 0])
      .within(8000),
  ]);

  // constants
  const radius = 7;
  const boxNum = 20;
  const delta = 0.0001;
  const planeScalar = 3.1;
  const boxSize = 1;
  const lightPos: [number, number, number] = [-1, 2, 3];
  const rotationSpeed = 0.001;

  // create the scene
  const scene = new THREE.Scene();

  // create and set up camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // TODO get rid of this!!
  camera.matrixAutoUpdate = false;

  const boxes: THREE.Mesh[] = [];

  // create and set up render and add canvas
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const cubeGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);

  for (let i = 0; i < boxNum; i++) {
    const angle = (i / boxNum) * 2 * Math.PI;
    const cube = makeInstance(
      cubeGeometry,
      new THREE.Color(`hsl(${(i / boxNum) * 360}, 50%, 50%)`),
      Math.sin(angle) * radius,
      0,
      Math.cos(angle) * radius
    );
    boxes.push(cube);
    scene.add(cube);
  }

  const planeSize = planeScalar * radius;
  const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);

  const plane = makeInstance(planeGeometry, 0xffffff, 0, -0.5 - delta, 0);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // create and set up light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(...lightPos);
  scene.add(light);

  const animate = (time: number) => {
    let num = 0;
    for (const m of boxes) {
      m.rotation.y = Math.sin(
        rotationSpeed * time + (num / boxNum) * 2 * Math.PI
      );
      num++;
    }

    const { pos, dir } = path.orientation(-time);
    //camera.position.x = pos[0];
    //camera.position.y = pos[1];
    //camera.position.z = pos[2];
    const look = add(pos, dir);
    //camera.lookAt(look[0], look[1], look[2]);

    /*
    console.log(
      "rotation",
      camera.rotation.x,
      camera.rotation.y,
      camera.rotation.z
    );
    */
    const m = lookAt(pos, look, [0, 1, 0]);
    camera.matrix.set(
      m[0][0],
      m[0][1],
      m[0][2],
      m[0][3],
      m[1][0],
      m[1][1],
      m[1][2],
      m[1][3],
      m[2][0],
      m[2][1],
      m[2][2],
      m[2][3],
      m[3][0],
      m[3][1],
      m[3][2],
      m[3][3]
    );
    //console.log("m", m);
    //console.log("world", camera.matrixWorld);
    //console.log("inverse", camera.matrixWorldInverse);
    camera.matrixAutoUpdate = false;
    camera.matrixWorldNeedsUpdate = true;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate(0);
}

/*
console.log(
  catmullRomPoint(
    [
      [0, 0, 0],
      [1, 1, 0],
      [1, 2, 0],
      [0, 3, 0],
    ],
    0.5
  )
);
*/
main();
