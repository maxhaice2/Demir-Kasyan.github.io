import * as THREE from '../three.addons/three.module.js';
import { GLTFLoader } from '../three.addons/three.gltfLoader.js';

import { MainControl } from './MainControl.js';


var camera, scene, renderer, control, loader, mesh;

            
            init();
            animate();

			function init() {
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 500;
				control = new MainControl( camera )
				scene = new THREE.Scene();
			
				var light = new THREE.PointLight();
				light.position.set(200, 200, 400);
				scene.add(light);
			
				var geometry = new THREE.IcosahedronGeometry(200,0);
				var material = new THREE.MeshPhongMaterial({
					specular: 0xff0000,
					shininess: 100,
					shading: THREE.FlatShading
				});
			
				mesh = new THREE.Mesh(geometry, material);
				scene.add(mesh);
			
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
				
				window.addEventListener( 'resize', onWindowResize, false );
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

            }
            function animate() {

				requestAnimationFrame( animate );

				control.update();
				renderer.render( scene, camera );

			}