let fixation = false,
    reSpace = true,
    $w = true,
    mv = true;

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
                if (!fixation && reSpace) {
                    element.setAttribute('visible', 'false');

                    let position = element.getAttribute('position');

                    setTimeout(() => reSpace = true, 7000);

                    document.getElementById('dinoModel').setAttribute('position', {
                        x: (position.x),
                        y: (position.y - 1.255),
                        z: (position.z)
                    });
                    reSpace = false;
                }
            });

            session.requestReferenceSpace('viewer').then((space) => {
                this.viewerSpace = space;
                session.requestHitTestSource({ space: this.viewerSpace })
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

                    if (!fixation && reSpace) {

                        this.el.setAttribute('visible', 'true');

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
            if (!fixation) {
                alert(0);
                move(this);
                fixation = true;
            }
        }
        );
    }
});
function move(el) {
    let X = el.getAttribute("position").x;
    let Y = el.getAttribute("position").y;
    let Z = el.getAttribute("position").z;
    el.setAttribute("animation",
        "property: position; to: " + Z + " " + Y + " " + ($w ? (Z + 1) : (Z - 1)) + "; dur: 3400; easing: linear; loop: false");

    if (mv) setTimeout(() => move(el), 2400);
}
AFRAME.registerComponent('rotat', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            if (fixation) {
                mv = false;
                let Y = this.getAttribute("position").y;
                this.setAttribute("animation",
                    "property: rotation; to: " + 0 + " " + ($w ? Y - 180 : Y + 180) + " " + 0 + "; dur: 1000; easing: linear; loop: false");
                $w = !$w;
                setTimeout(() => {
                    mv = true;
                    move( this );
                }, 1001);
            }
        });
    }
});


