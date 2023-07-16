import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth  / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener('resize', onResize, false);

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const geometry = new THREE.BufferGeometry;
const count = 1000;

const positionsArr = new Float32Array(count * 3);

for(let i = 0; i< count*3; i++) {
  positionsArr[i] = (Math.random() -0.5) *10
}
const mousePositions = {};
document.addEventListener('mousemove', (e) => {
  mousePositions.x = e.clientX;
  mousePositions.y = e.clientY;
})

geometry.setAttribute('position', new THREE.BufferAttribute(positionsArr, 3))

const material = new THREE.PointsMaterial()
material.size = 0.02
material.sizeAttenuation = true;

const particles = new THREE.Points( geometry, material );
scene.add( particles );
camera.position.z = 5;
let countAn = 0;

  var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff,  opacity: 0.9 });
  const points = []

  for(let i = -10; i< 10; i+=0.1){
    points.push(new THREE.Vector3(i, 0 , 0))
  }
  var linegeometry = new THREE.BufferGeometry().setFromPoints(points);
  let xAxis =  new THREE.Line(linegeometry, lineMaterial);
  let up = false;
function animate() {
  if(++countAn >= 103) {
    scene.add(xAxis);
    if(countAn< 105) {
    for(let i = 0; i< document.getElementsByClassName('line').length; i++) {
      document.getElementsByClassName('line')[i].style.animation = "movedown 500ms forwards"
    }
  } else {
    document.getElementsByClassName('arrow')[0].addEventListener('click', async () => {
      if(!up) {
        await new Promise((resolve) => {
          setTimeout(resolve, 10)
        })
        up = true;
        document.getElementById('line1').style.animation = "slideleft1 500ms forwards"
        document.getElementById('line2').style.animation = "slideleft2 500ms forwards"
        document.getElementById('line3').style.animation = "slideright1 500ms forwards"
        document.getElementById('line4').style.animation = "slideright2 500ms forwards"
        document.getElementsByClassName('box')[0].style.animation = "maximize 500ms forwards"
        document.getElementsByClassName('arrow')[0].style.animation = "moveuparrow 500ms forwards"
        document.getElementsByClassName('arrow')[0].style.transform = "scaleY(-1)"
        document.getElementsByClassName('arrow')[0].style.bottom = "42.5vh"
        document.getElementsByClassName('consolee')[0].style.animation = "moveupconsolee 1s forwards"
        document.getElementsByClassName('consolee')[0].style.overflow = "visible"
        document.getElementsByClassName('name')[0].style.animation = "moveupname 1s forwards"
        setTimeout(() => {
          document.getElementsByClassName('info')[0].style.animation = "fadein 500ms forwards"
          document.getElementsByClassName('contactbtns')[0].style.animation = "fadein 500ms forwards"
          document.getElementsByClassName('languages')[0].style.animation = "fadein 500ms forwards"
          document.getElementsByClassName('games')[0].style.animation = "fadein 500ms forwards"
        }, 300)
        for(let i = 0; i< points.length; i++) {
          points[i].y = -10
        }
        linegeometry.computeBoundingBox()
          linegeometry = new THREE.BufferGeometry().setFromPoints(points);
          scene.remove(xAxis)
          xAxis = new THREE.Line(linegeometry, lineMaterial)
          scene.add(xAxis)
          renderer.render(scene, camera);
      } else {
        await new Promise((resolve) => {
          setTimeout(resolve, 10)
        })
        up = false;
        document.getElementById('line1').style.animation = "unslideleft1 500ms forwards"
        document.getElementById('line2').style.animation = "unslideleft2 500ms forwards"
        document.getElementById('line3').style.animation = "unslideright1 500ms forwards"
        document.getElementById('line4').style.animation = "unslideright2 500ms forwards"
        document.getElementsByClassName('box')[0].style.animation = "minimize 500ms forwards"
        document.getElementsByClassName('arrow')[0].style.animation = "movedownarrow 500ms forwards"
        document.getElementsByClassName('arrow')[0].style.transform = "scaleY(1)"
        document.getElementsByClassName('arrow')[0].style.bottom = "46vh"
        document.getElementsByClassName('consolee')[0].style.animation = "movedownconsolee 1s forwards"
        document.getElementsByClassName('name')[0].style.animation = "movedownname 1s forwards"
        document.getElementsByClassName('info')[0].style.animation = "fadeout 200ms forwards"
        document.getElementsByClassName('contactbtns')[0].style.animation = "fadeout 200ms forwards"
        document.getElementsByClassName('languages')[0].style.animation = "fadeout 200ms forwards"
        document.getElementsByClassName('games')[0].style.animation = "fadeout 200ms forwards"
        for(let i = 0; i< points.length; i++) {
          points[i].y = 0
        }
        linegeometry.computeBoundingBox()
          linegeometry = new THREE.BufferGeometry().setFromPoints(points);
          scene.remove(xAxis)
          xAxis = new THREE.Line(linegeometry, lineMaterial)
          scene.add(xAxis)
          renderer.render(scene, camera);
      }
  })
  }
    
    for(let i = 0; i<points.length;i++) {
      
      if((points[i].x - 1) < (((mousePositions.x*2)/renderer.domElement.width) -1)*10 && (points[i].x + 1) > (((mousePositions.x*2)/renderer.domElement.width) -1)*10 && (points[i].y - 1) < (((mousePositions.y*2)/renderer.domElement.height)-1.05)*10 && (points[i].y + 1) > (((mousePositions.y*2)/renderer.domElement.height)-1.05)*10) {
        if((((mousePositions.y*2)/renderer.domElement.height)-1.05)*10< points[i].y) {
          points[i].y -= 0.07
        } else {
          points[i].y += 0.07
        }
        linegeometry.computeBoundingBox()
        linegeometry = new THREE.BufferGeometry().setFromPoints(points);
        scene.remove(xAxis)
        xAxis = new THREE.Line(linegeometry, lineMaterial)
        scene.add(xAxis)
      } else {
        if(!up) {
          points[i].y = 0
          linegeometry.computeBoundingBox()
          linegeometry = new THREE.BufferGeometry().setFromPoints(points);
          scene.remove(xAxis)
          xAxis = new THREE.Line(linegeometry, lineMaterial)
          scene.add(xAxis)
        }
      }
    }
    renderer.render(scene, camera);
  } 

	requestAnimationFrame( animate )

  particles.rotation.y += 0.01
  particles.scale.y  -= 0.01
	renderer.render( scene, camera );
}

animate();