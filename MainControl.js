import {
	Euler,
	MathUtils,
	Quaternion,
	Vector3
} from "./three.module.js";

var MainControl = function ( object ) {

	var scope = this;

    var vec = new Vector3();

	this.object = object;
	this.object.rotation.reorder( 'YXZ' );

	this.enabled = true;

    this.deviceOrientation = {};
    this.deviceMotion = {};
	this.screenOrientation = 0;

	this.alphaOffset = 0;

    var onDeviceMotionChangeEvent = function ( event ) {

        scope.deviceMotion = event;

    };

	var onDeviceOrientationChangeEvent = function ( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = window.orientation || 0;

	};

	var setObjectQuaternion = function () {

		var zee = new Vector3( 0, 0, 1 );

		var euler = new Euler();

		var q0 = new Quaternion();

		var q1 = new Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); 

		return function ( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' ); 

			quaternion.setFromEuler( euler );

			quaternion.multiply( q1 ); 

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); 

		};

	}();

	this.connect = function () {

		onScreenOrientationChangeEvent(); 

        
        if ( window.DeviceMotionEvent ) {

            window.addEventListener( 'devicemotion', onDeviceMotionChangeEvent, false );
			
			let motion = scope.deviceMotion;
			
			if( motion ) {

				vec = new Vector3(motion.accelerationIncludingGravity.x, 
					motion.accelerationIncludingGravity.y,
					motion.accelerationIncludingGravity.z);

			}

        } else {
            console.error("Somethingwrongbabe");
        }

		if ( window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function' ) {

			window.DeviceOrientationEvent.requestPermission().then( function ( response ) {

				if ( response == 'granted' ) {

					window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
					window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

				}

			} ).catch( function ( error ) {

				console.error( 'THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:', error );

			} );

		} else {

			window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
			window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

        }
		scope.enabled = true;

	};

	this.disconnect = function () {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	this.update = function () {

		if ( scope.enabled === false ) return;

		var device = scope.deviceOrientation;
		var motion = scope.deviceMotion;
		
		if ( device ) {

			var alpha = device.alpha ? MathUtils.degToRad( device.alpha ) + scope.alphaOffset : 0; // Z

			var beta = device.beta ? MathUtils.degToRad( device.beta ) : 0; // X'

			var gamma = device.gamma ? MathUtils.degToRad( device.gamma ) : 0; // Y''

			var orient = scope.screenOrientation ? MathUtils.degToRad( scope.screenOrientation ) : 0; // O

			setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

		}

        if( motion ){

			object.position.x += Math.floor( motion.accelerationIncludingGravity.x - vec.x);

			object.position.z += Math.floor( motion.accelerationIncludingGravity.z - vec.z);

        } else {

            console.error("BIG DUMBASS");
        
        }
        

	};

	this.dispose = function () {

		scope.disconnect();

	};

	this.connect();

};

export { MainControl };