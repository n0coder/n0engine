import { p } from "../engine/core/p5engine.js";

export const p2 = {
    variableLine(x1, y1, x2, y2, startWidth = 2, endWidth = 4) {
        const halfStart = startWidth * 0.5;
        const halfEnd = endWidth * 0.5;
        
        // Get normalized direction vector
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) return; // Avoid division by zero
        
        const normalizedX = dx / length;
        const normalizedY = dy / length;
        
        // Get perpendicular vector (rotate 90 degrees)
        const perpX = -normalizedY;
        const perpY = normalizedX;
        
        // Create quad shape
        p.beginShape();
        p.vertex(x1 - perpX * halfStart, y1 - perpY * halfStart);
        p.vertex(x2 - perpX * halfEnd, y2 - perpY * halfEnd);
        p.vertex(x2 + perpX * halfEnd, y2 + perpY * halfEnd);
        p.vertex(x1 + perpX * halfStart, y1 + perpY * halfStart);
        p.endShape(p.CLOSE);
        
        // End caps
        p.ellipse(x1, y1, startWidth);
        p.ellipse(x2, y2, endWidth);
    },
    
    smoothLine(points, width = 2) {
        if (points.length < 2) return;
        
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            this.variableLine(p1.x, p1.y, p2.x, p2.y, width, width);
        }
    },
    
    taperedLine(points, startWidth = 2, endWidth = 4) {
        if (points.length < 2) return;
        
        for (let i = 0; i < points.length - 1; i++) {
            const progress = i / (points.length - 2);
            const currentWidth = startWidth + (endWidth - startWidth) * progress;
            const nextProgress = (i + 1) / (points.length - 2);
            const nextWidth = startWidth + (endWidth - startWidth) * nextProgress;
            
            const p1 = points[i];
            const p2 = points[i + 1];
            this.variableLine(p1.x, p1.y, p2.x, p2.y, currentWidth, nextWidth);
        }
    },
    
    // Utility methods
    normalize(x, y) {
        const length = Math.sqrt(x * x + y * y);
        return length === 0 ? { x: 0, y: 0 } : { x: x / length, y: y / length };
    },
    
    perpendicular(x, y) {
        return { x: -y, y: x };
    },
    
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
}