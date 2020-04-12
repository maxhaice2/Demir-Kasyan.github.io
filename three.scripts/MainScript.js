import * as THREE from '../three.addons/three.module.js';
import { GLTFLoader } from '../three.addons/three.gltfLoader.js';

import { MainControl } from './MainControl.js';


var camera, scene, renderer, control, loader;

			var raycaster;
			var vertex = new THREE.Vector3();
			var color = new THREE.Color();
            
            init();
            animate();

			function init() {

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.y = 10;

			
				scene = new THREE.Scene();
			
				var light = new THREE.AmbientLight(0xFFFFFF, 1);
				scene.add(light);
				scene = new THREE.Scene();

				control = new MainControl( camera );

                loader = new GLTFLoader();

				scene.add( camera );
                
                // loader.load( '../three.models/Card.gltf', function ( data ) {
				// 	 var object = data.scene;
					 
				// 		object.position.set(1.0, 10.0, 0.0);
						
                //         scene.add( object );
                // });

				{
					const sphereRadius = 3;
					const sphereWidthDivisions = 32;
					const sphereHeightDivisions = 16;
					const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
					const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
					   const mesh = new THREE.Mesh(sphereGeo, sphereMat);
					   mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
					scene.add(mesh);
				}
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