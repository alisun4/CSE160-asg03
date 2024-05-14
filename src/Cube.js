class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
    }

    render() {
        var rgba = this.color;
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        drawTriangle3D( [0,0,0, 1,1,0, 1,0,0] );
        drawTriangle3D( [0,0,0, 0,1,0, 1,1,0] );
        drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [1,0, 0,1, 1,1] );
        drawTriangle3DUV( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1] );

        // Top of cube
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3D( [0,1,0, 0,1,1, 1,1,1] );
        drawTriangle3D( [0,1,0, 1,1,1, 1,1,0] );
        // drawTriangle3DUV( [0,1,0, 1,1,1, 1,1,0], [0, 0, 1,1, 1,0]);
        // drawTriangle3DUV( [0,1,0, 0,1,1, 1,1,1], [0, 0, 0,1, 1,1]);

        // Bottom
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3D( [0,0,0, 1,0,1, 0,0,1] );
        drawTriangle3D( [0,0,0, 1,0,0, 1,0,1] );
        drawTriangle3DUV( [0,0,0, 1,0,1, 0,0,1], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,0,0, 1,0,0, 1,0,1], [0,0, 0,1, 1,1]);

        // Left
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3D( [1,0,0, 1,1,1, 1,1,0] );
        drawTriangle3D( [1,0,0, 1,0,1, 1,1,1] );
        drawTriangle3DUV( [1,0,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [1,0,0, 1,0,1, 1,1,1], [0,0, 0,1, 1,1] );

        // Right
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3D( [0,0,0, 0,1,1, 0,1,0] );
        drawTriangle3D( [0,0,0, 0,0,1, 0,1,1] );
        drawTriangle3DUV( [0,0,0, 0,1,1, 0,1,0], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,0,0, 0,0,1, 0,1,1], [0,0, 0,1, 1,1] );

        // Back
        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
        drawTriangle3D( [0,0,1, 1,1,1, 0,1,1] );
        drawTriangle3D( [0,0,1, 1,0,1, 1,1,1] );
        drawTriangle3DUV( [0,0,1, 1,1,1, 0,1,1], [0,0, 1,1, 1,0] );
        drawTriangle3DUV( [0,0,1, 1,0,1, 1,1,1], [0,0, 0,1, 1,1] );

    }

    drawCube(M, color) {
        // Set the color uniform variable
        gl.uniform4fv(u_FragColor, color);

        // Set the model matrix uniform variable
        gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

        // Draw the cube
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);    
        
        // Change lighting using uniform4f

         // Draw front face
        drawTriangle3D([0, 0, 0, 1, 1, 0, 1, 0, 0]);
        drawTriangle3D([0, 0, 0, 0, 1, 0, 1, 1, 0]);

        // Draw top face
        gl.uniform4f(u_FragColor, color[0]* 0.9, color[1]* 0.9, color[2]* 0.9, color[3]);
        drawTriangle3D([0, 1, 0, 1, 1, 0, 1, 1, 1]);
        drawTriangle3D([0, 1, 0, 0, 1, 1, 1, 1, 1]);

        // Draw left face
        gl.uniform4f(u_FragColor, color[0]* 0.8, color[1]* 0.8, color[2]* 0.8, color[3]);
        drawTriangle3D([0, 0, 0, 0, 1, 0, 0, 1, 1]);
        drawTriangle3D([0, 0, 0, 0, 0, 1, 0, 1, 1]);

        // Draw right face
        gl.uniform4f(u_FragColor, color[0]* 0.7, color[1]* 0.7, color[2]* 0.7, color[3]);

        drawTriangle3D([1, 0, 0, 1, 1, 0, 1, 1, 1]);
        drawTriangle3D([1, 0, 0, 1, 0, 1, 1, 1, 1]);

        // Draw bottom face
        gl.uniform4f(u_FragColor, color[0]* 0.6, color[1]* 0.6, color[2]* 0.6, color[3]);

        drawTriangle3D([0, 0, 0, 1, 0, 0, 1, 0, 1]);
        drawTriangle3D([0, 0, 0, 0, 0, 1, 1, 0, 1]);

        // Draw back face
        gl.uniform4f(u_FragColor, color[0]* 0.5, color[1]* 0.5, color[2]* 0.5, color[3]);

        drawTriangle3D([0, 0, 1, 1, 1, 1, 1, 0, 1]);
        drawTriangle3D([0, 0, 1, 0, 1, 1, 1, 1, 1]);
    }

}