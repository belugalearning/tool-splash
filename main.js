require.config({
    paths: {
        'instructioncontainer': '../../tools/splash/instruction-container',
        'instructiondragbutton': '../../tools/splash/instruction-drag-button',
        'instructionticker': '../../tools/splash/instruction-ticker',
        'constants': '../../tools/splash/constants'
    }
});

define(['exports', 'cocos2d', 'qlayer', 'toollayer', 'instructioncontainer', 'instructiondragbutton', 'instructionticker' ], function (exports, cc, QLayer, ToolLayer, InstructionContainer, InstructionDragButton, InstructionTicker) {
    'use strict';


    window.bl.toolTag = 'splash';
    var Tool = ToolLayer.extend({

        _windowSize: undefined,
        _background: undefined,
        _backgroundLayer: undefined,

        init: function () {
            var self = this;

            this._super();

            this.setTouchEnabled(true);

            this._windowSize = cc.Director.getInstance().getWinSize();

            // cc.Director.getInstance().setDisplayStats(false);

            this.setQuestion();

            return this;
        },

        reset: function () {
            this._super();
        },

        getState: function () {
            throw {name : "NotImplementedError", message : "This needs implementing"};
        },

        setQuestion: function () {

            this.setBackground(window.bl.getResource('deep_water_background'));

            var instructionContainer = new InstructionContainer();
            instructionContainer.setPosition(this._windowSize.width/2, this._windowSize.height/2);
            instructionContainer.setZOrder(1);
            this.addChild(instructionContainer);

            var instructionTicker = new InstructionTicker();
            instructionTicker.setPosition(this._windowSize.width/2, 100);
            this.addChild(instructionTicker);
        },

    });

    ToolLayer.create = function () {
        var sg = new ToolLayer();
        if (sg && sg.init(cc.c4b(255, 255, 255, 255))) {
            return sg;
        }
        return null;
    };

    ToolLayer.scene = function () {
        var scene = cc.Scene.create();
        var layer = ToolLayer.create();
        scene.addChild(layer);

        scene.layer=layer;

        scene.ql = new QLayer();
        scene.ql.init();
        layer.addChild(scene.ql, 99);

        scene.update = function(dt) {
            this.layer.update(dt);
            this.ql.update(dt);
        };
        scene.scheduleUpdate();


        return scene;
    };

    exports.ToolLayer = Tool;

});
