define([], function() {

	var TraceNode = cc.DrawNode.extend({
		ctor:function() {
			this._super();
			this.vertices = [];
			this.currentVertex;
			this.radius = 4;
			this.color = cc.c4f(229/255, 126/255, 30/255, 1);
		},

		removeLastLineFromBuffer:function() {
			this._buffer.splice(this._buffer.length - 2, 2);
		},

		drawDotAndLine:function(start, end) {
			this.drawDot(start, this.radius - 1, this.color);
			this.drawSegment(start, end, this.radius, this.color);
		},

		drawLastLine:function() {
			this.removeLastLineFromBuffer();
			this.drawDotAndLine(this.vertices[this.vertices.length-1], this.currentVertex);
		},

		addLastLine:function() {
			this.vertices.push(this.currentVertex);
			this.drawDotAndLine(this.vertices[this.vertices.length-2], this.vertices[this.vertices.length-1]);
		},

	});

	return TraceNode;

})