class Camera {
    constructor() {
        this.eye = new Vector3([0, 0, 3]);
        // this.eye = [0,0,3];
        this.at = new Vector3([0, 0, -100]);
        // this.at = [0,0,-100];
        this.up = new Vector3([0, 1, 0]);
        // this.up = [0,1,0];
        // this.fov = 60;
        this.speed = 0.2;
    }

    forward() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);
        this.eye = this.eye.add(f);
        this.at = this.at.add(f);
    }

    back() {
        var f = new Vector3();
        f.set(this.eye);
        f.sub(this.at);
        f.normalize();
        f.mul(this.speed);
        this.eye = this.eye.add(f);
        this.at = this.at.add(f);
    }

    left() {
        var f = new Vector3;
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);
        var s = Vector3.cross(this.up, f);
        this.at.add(s);
        this.eye.add(s);
    }

    right() {
        var f = new Vector3;
        f.set(this.eye);
        f.sub(this.at);
        f.normalize();
        f.mul(this.speed);
        var s = Vector3.cross(this.up, f);
        this.at.add(s);
        this.eye.add(s);
    }

    panUp() {
        this.at.elements[1] += 5;
    }

    panDown() {
        this.at.elements[1] -= 5;
    }

    panLeft() {         // SOURCE: Plain Ol' Bees – https://people.ucsc.edu/~jbrowne2/asgn3/World.html
        var atP = new Vector3;
        atP.set(this.at);
        atP.sub(this.eye);
        var r = Math.sqrt(atP.elements[0]*atP.elements[0] + atP.elements[2]*atP.elements[2]);
        var theta = Math.atan2(atP.elements[2], atP.elements[0]);
        theta -= (5 * Math.PI / 180);
        atP.elements[0] = r * Math.cos(theta);
        atP.elements[2] = r * Math.sin(theta);
        this.at.set(atP);
        this.at.add(this.eye);
    }
   
    panRight() {        // SOURCE: Plain Ol' Bees – https://people.ucsc.edu/~jbrowne2/asgn3/World.html
        var atP = new Vector3;
        atP.set(this.at);
        atP.sub(this.eye);
        var r = Math.sqrt(atP.elements[0]*atP.elements[0] + atP.elements[2]*atP.elements[2]);
        var theta = Math.atan2(atP.elements[2], atP.elements[0]);
        theta += (5 * Math.PI / 180);
        atP.elements[0] = r * Math.cos(theta);
        atP.elements[2] = r * Math.sin(theta);
        this.at.set(atP);
        this.at.add(this.eye);
    }
}
