let fixation = false,
    alignment = false,
    reSpace = true, 
    sound = new Audio('https://cdn.jsdelivr.net/gh/Demir-Kasyan/Demir-Kasyan.github.io/resourses/trash/intro2.mp3');
    console.log('okey!');alert(" ");
    AFRAME.registerComponent('ar-hit-test', {
			init: function () {
				this.xrHitTestSource = null;
				this.viewerSpace = null;
				this.refSpace = null;

				this.el.sceneEl.renderer.xr.addEventListener('sessionend', (ev) => {
					this.viewerSpace = null;
					this.refSpace = null;
					this.xrHitTestSource = null;
				});
				this.el.sceneEl.renderer.xr.addEventListener('sessionstart', (ev) => {
					let session = this.el.sceneEl.renderer.xr.getSession();

					let element = this.el;
					session.addEventListener('select', function () {
					  if(!fixation) {
                        element.setAttribute('visible','false');

						let position = element.getAttribute('position');
                        
                        setTimeout(() => reSpace = true, 8000);
                        
						document.getElementById('cards').setAttribute('position', {
                            x: (position.x),
							y: (position.y - 1.255),
							z: (position.z)
                        });
						reSpace = false;
					  }
					});

					session.requestReferenceSpace('viewer').then((space) => {
						this.viewerSpace = space;
						session.requestHitTestSource({space: this.viewerSpace})
								.then((hitTestSource) => {
									this.xrHitTestSource = hitTestSource;
								});
					});

					session.requestReferenceSpace('local-floor').then((space) => {
						this.refSpace = space;
					});
				});
			},
			tick: function () {
				if (this.el.sceneEl.is('ar-mode')) {
					if (!this.viewerSpace) return;

					let frame = this.el.sceneEl.frame;
					let xrViewerPose = frame.getViewerPose(this.refSpace);

					if (this.xrHitTestSource && xrViewerPose) {
						let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
						if (hitTestResults.length > 0) {
                          
                          if(!fixation && reSpace) {

                            this.el.setAttribute('visible','true');

							let pose = hitTestResults[0].getPose(this.refSpace);

							let inputMat = new THREE.Matrix4();
							inputMat.fromArray(pose.transform.matrix);

							let position = new THREE.Vector3();
							position.setFromMatrixPosition(inputMat);
                            this.el.setAttribute('position', position);
                            
							}
						}
					}
				}
			}
        });

    AFRAME.registerComponent('fix', {
            init: function () {
                this.el.addEventListener('click', function (evt) {
                    this.setAttribute("visible",
                                      "false");
                      fixation = true;
              
                                                                 }
                                        );
        }});

    AFRAME.registerComponent('click-card', {
            init: function () {
                this.el.addEventListener('click', function (evt) {
                    if( !sound.paused ){
                        sound.pause();
                    }
                    sound = new Audio("https://cdn.jsdelivr.net/gh/Demir-Kasyan/Demir-Kasyan.github.io/resourses/trash/"+setSound(this.getId()));
                    sound.play();

                    elem.setAttribute("animation",
                    "property: rotation; to: -90 0 0; dur: 1200; loop: false");
                                                                 }
                                        );
        }});

	AFRAME.registerComponent('aligmenting-4-on-8', {
          init: function () {
              this.el.addEventListener('click', function (evt) {
				 if( fixation ){

                    setAligmenting(document.getElementById('first'),1);

                    setTimeout(() => setAligmenting(document.getElementById('second'), 2 ) , 40001 );

                    setTimeout(() => setAligmenting(document.getElementById('third'), 3 ) , 80002 );

                    setTimeout(() => setAligmenting(document.getElementById('fourth'), 4 ) , 120003 );
                 }});
        }});
                              
    
    function setAligmenting(elem, posit){
            let poseX = ( posit > 4 ? "-" : "") + ( 0.50 - posit * 0.10);
            let poseZ = ( posit < 5 ) ? ( -0.10 + posit * 0.10 ) : ( 0.40 - posit * 0.10);
            let poseY = 2.5;
            elem.setAttribute("animation",
                                "property: position; to: " + poseZ + " " + poseY + " " + poseX + "; dur: 4000; easing: linear; loop: false");
        }

    function setSound(posit){
        switch (posit){
            case 'first':
                return "intro2.mp3";
            case 'second':
                return "intro2.mp3";
            case 'third':
                return "intro2.mp3";
            case 'fourth':
                return "intro2.mp3";
            default:
                return "intro2.mp3";
        }
        }
  