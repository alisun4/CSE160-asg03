class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
    }

    render() {
        var rgba = this.color;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [1,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1] );

        // Top of cube
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3DUV( [0,1,0, 1,1,1, 1,1,0], [0, 0, 1,1, 1,0]);
        drawTriangle3DUV( [0,1,0, 0,1,1, 1,1,1], [0, 0, 0,1, 1,1]);

        // Bottom
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3DUV( [0,0,0, 1,0,1, 0,0,1], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,0,0, 1,0,0, 1,0,1], [0,0, 0,1, 1,1]);

        // Left
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3DUV( [1,0,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [1,0,0, 1,0,1, 1,1,1], [0,0, 0,1, 1,1] );

        // Right
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3DUV( [0,0,0, 0,1,1, 0,1,0], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,0,0, 0,0,1, 0,1,1], [0,0, 0,1, 1,1] );

        // Back
        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
        drawTriangle3DUV( [0,0,1, 1,1,1, 0,1,1], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,0,1, 1,0,1, 1,1,1], [0,0, 0,1, 1,1] );

    }

}