require.config({
    paths: {
        'instructioncontainer': '../../tools/splash/instruction-container',
        'instructiondragbutton': '../../tools/splash/instruction-drag-button',
        'instructiondraggable': '../../tools/splash/instruction-draggable',
        'instructionticker': '../../tools/splash/instruction-ticker',
        'instructiondraggable': '../../tools/splash/instruction-draggable',
        'scrollbar': '../../tools/splash/scroll-bar',
        'constants': '../../tools/splash/constants'
    }
});

define(['exports', 'cocos2d', 'qlayer', 'toollayer', 'instructioncontainer', 'instructiondragbutton', 'instructiondraggable', 'instructionticker', 'constants' ], function (exports, cc, QLayer, ToolLayer, InstructionContainer, InstructionDragButton, InstructionDraggable, InstructionTicker, constants) {
    'use strict';

    var InstructionTypes = constants["InstructionTypes"];

    var defaultButtonZOrder = 1;
    var foregroundZOrder = 100;

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

            this.instructionContainer = new InstructionContainer();
            this.instructionContainer.setPosition(this._windowSize.width/2, this.instructionContainer.getContentSize().height/2 + 10);
            this.instructionContainer.setZOrder(1);
            this.addChild(this.instructionContainer);

            this.setupInstructionButtons();

            this.instructionTicker = new InstructionTicker();
            this.instructionTicker.setPosition(this._windowSize.width/2, 175);
            this.addChild(this.instructionTicker);
        },

        setupInstructionButtons:function() {
            var self = this;
            var defaultButtonZOrder = 1;
            _.each(InstructionTypes, function(type) {
                if (type["include_in_container"]) {
                    var instructionButton = new InstructionDragButton()
                    instructionButton.initWithType(type);
                    var positionInContainer = self.instructionContainer.getPositionForInstruction(type);
                    var positionInWorld = self.instructionContainer.convertToWorldSpace(positionInContainer);
                    instructionButton.setPosition(positionInWorld);
                    instructionButton.setZOrder(defaultButtonZOrder);
                    self.addChild(instructionButton);

                    self.setInstructionTouchFunctions(instructionButton);
                };
            })
        },

        setInstructionTouchFunctions:function(button) {
            var self = this;

            var highlighting = false;

            button.onTouchDown(function() {
                this.setVisible(true);
                self.reorderChild(button, foregroundZOrder);
            });

            button.onMoved(function(touchLocation) {
                if (self.instructionTicker.touched(touchLocation)) {
                    var touchRelative = self.instructionTicker.convertToNodeSpace(touchLocation);
                    self.instructionTicker.highlightHovered(touchRelative);
                    highlighting = true;
                } else {
                    if (highlighting) {
                        self.instructionTicker.clearHighlight();
                        highlighting = false;
                    };
                };
            });


            button.onMoveEnded(function(touchLocation) {
                self.reorderChild(button, defaultButtonZOrder);
                if (self.instructionTicker.touched(touchLocation)) {
                    var touchRelative = self.instructionTicker.convertToNodeSpace(touchLocation);
                    this.removeFromParent();
                    if (this.type === InstructionTypes.LOOP) {
                        var openBracket = new InstructionDraggable();
                        openBracket.initWithType(InstructionTypes.OPEN_BRACKET);
                        var closeBracket = new InstructionDraggable();
                        closeBracket.initWithType(InstructionTypes.CLOSE_BRACKET);
                        self.instructionTicker.dropInInstructionBoxes([openBracket, closeBracket], touchRelative);
                        openBracket.linked = [closeBracket];
                        closeBracket.linked = [openBracket];
                    } else {
                        self.instructionTicker.dropInInstructionBoxes([this], touchRelative);
                        this.linked = [];
                    };
                    button.setupDraggable();
                    self.setInstructionTouchFunctions(button);
                } else {
                    this.setVisible(false);
                    this.returnToHomePosition();
                };
                if (highlighting) {
                    self.instructionTicker.clearHighlight();
                    highlighting = false;
                };
            });
        }
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
