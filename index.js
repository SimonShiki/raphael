import { Extension, type, api } from 'clipcc-extension';
import CtxManager from './ctx-manager';
import Cast from './cast';
import Color from './color';
import { flatGradient } from './gradient';

class Raphael extends Extension {
    constructor () {
        super();
        this.makeBlocks = this.makeBlocks.bind(this);
        this.onInit = this.onInit.bind(this);
        this.onUninit = this.onUninit.bind(this);
        const { runtime } = api.getVmInstance();
        this.manager = new CtxManager(runtime);
        this.currentId = 1;
    }
    
    makeBlocks (easyBlocks) {
        const blocks = [];
        for (const easyBlock of easyBlocks) {
            blocks.push({
                opcode: `shiki.raphael.${easyBlock.opcode}`,
                type: easyBlock.type || type.BlockType.COMMAND,
                param: easyBlock.param,
                branchCount: easyBlock.branchCount || 0,
                messageId: `shiki.raphael.${easyBlock.opcode}`,
                categoryId: `shiki.raphael.category`,
                function: easyBlock.func
            });
        }
        api.addBlocks(blocks);
    }
    
    makeMenuFromArray (arr) {
        const menu = [];
        for (const item of arr) {
            menu.push({
                messageId: `shiki.raphael.menu.${item}`,
                value: item
            });
        }
        return menu;
    }
    
    onInit () {
        api.addCategory({
            categoryId: 'shiki.raphael.category',
            messageId: 'shiki.raphael.category',
            color: '#C21F30'
        });
        this.makeBlocks([{
            opcode: 'setArtboardIdTo',
            param: {
                ID: {
                    type: type.ParameterType.NUMBER,
                    default: '1'
                }
            },
            func: (args) => {
                this.currentId = Math.max(1, Cast.toNumber(args.ID));
            }
        }, {
            opcode: 'get',
            type: type.BlockType.REPORTER,
            param: {
                ATTRIBUTE: {
                    type: type.ParameterType.STRING,
                    default: 'font',
                    menu: this.makeMenuFromArray([
                        'lineWidth',
                        'lineDashOffset',
                        'miterLimit',
                        'shadowBlur',
                        'shadowOffsetX',
                        'shadowOffsetY',
                        'globalAlpha',
                        'globalCompositeOperation',
                        'font',
                        'textAlign',
                        'textBaseline',
                        'direction',
                        'fillStyle',
                        'strokeStyle',
                        'lineDash'])
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                if (args.ATTRIBUTE === 'lineDash') {
                    const lineDash = ctx.getLineDash();
                    return `[${lineDash.join(', ')}]`;
                }
                return ctx[args.ATTRIBUTE];
            }
        }, {
            opcode: 'setArttibuteTo',
            param: {
                ATTRIBUTE: {
                    type: type.ParameterType.STRING,
                    default: 'lineWidth',
                    menu: this.makeMenuFromArray([
                        'lineWidth',
                        'lineDashOffset',
                        'miterLimit',
                        'shadowBlur',
                        'shadowOffsetX',
                        'shadowOffsetY',
                        'globalAlpha'])
                },
                NUMBER: {
                    type: type.ParameterType.NUMBER,
                    default: '1'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx[args.ARTTIBUTE] = Cast.toNumber(args.NUMBER);
            }
        }, {
            opcode: 'setLineCap',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'butt',
                    menu: this.makeMenuFromArray([
                        'butt',
                        'round',
                        'square'])
                },
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.lineCap = args.VALUE;
            }
        }, {
            opcode: 'setLineJoin',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'miter',
                    menu: this.makeMenuFromArray([
                        'round',
                        'bevel',
                        'miter'])
                },
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.lineJoin = args.VALUE;
            }
        }, {
            opcode: 'setLineDash',
            param: {
                ARRAY: {
                    type: type.ParameterType.STRING,
                    default: '[1, 2]'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                const lineDash = JSON.parse(args.ARRAY);
                ctx.setLineDash(lineDash);
            }
        }, {
            opcode: 'setFont',
            param: {
                FONT: {
                    type: type.ParameterType.STRING,
                    default: '10px sans-serif'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.font = args.FONT;
            }
        }, {
            opcode: 'setTextAlign',
            param: {
                ALIGN: {
                    type: type.ParameterType.STRING,
                    default: 'start',
                    menu: this.makeMenuFromArray([
                        'start',
                        'end',
                        'left',
                        'right',
                        'center'])
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.textAlign = args.ALIGN;
            }
        }, {
            opcode: 'setTextBaseline',
            param: {
                BASELINE: {
                    type: type.ParameterType.STRING,
                    default: 'alphabetic',
                    menu: this.makeMenuFromArray([
                        'top',
                        'hanging',
                        'middle',
                        'alphabetic',
                        'ideographic',
                        'bottom'])
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.textBaseline = args.BASELINE;
            }
        }, {
            opcode: 'setDirection',
            param: {
                DIRECTION: {
                    type: type.ParameterType.STRING,
                    default: 'inherit',
                    menu: this.makeMenuFromArray([
                        'ltr',
                        'rtl',
                        'inherit'])
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.direction = args.DIRECTION;
            }
        }, {
            opcode: 'measureText',
            type: type.BlockType.REPORTER,
            param: {
                TEXT: {
                    type: type.ParameterType.STRING,
                    default: 'This extension uses canvas'
                },
                ATTRIBUTE: {
                    type: type.ParameterType.STRING,
                    default: 'actualBoundingBoxLeft',
                    menu: this.makeMenuFromArray([
                        'width',
                        'actualBoundingBoxLeft',
                        'actualBoundingBoxRight',
                        'fontBoundingBoxAscent',
                        'fontBoundingBoxDescent',
                        'actualBoundingBoxAscent',
                        'actualBoundingBoxDescent',
                        'emHeightAscent',
                        'emHeightDescent',
                        'hangingBaseline', 
                        'alphabeticBaseline', 
                        'ideographicBaseline'])
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                const textMetrics = ctx.measureText(args.TEXT);
                return textMetrics[args.ATTRIBUTE];
            }
        }, {
            opcode: 'hexToDec',
            type: type.BlockType.REPORTER,
            param: {
                HEX: {
                    type: type.ParameterType.STRING,
                    default: '#479cff'
                }
            },
            func: (args) => Color.hexToDecimal(args.HEX)
        }, {
            opcode: 'setColor',
            param: {
                TYPE: {
                    type: type.ParameterType.STRING,
                    default: 'fill',
                    menu: this.makeMenuFromArray([
                        'fill',
                        'stroke',
                        'shadow'])
                },
                COLOR: {
                    type: type.ParameterType.COLOR,
                    default: '#4c97ff'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                if (args.TYPE === 'shadow') ctx.shadowColor = Color.decimalToHex(args.COLOR);
                else ctx[`${args.TYPE}Style`] = Color.decimalToHex(args.COLOR);
            }
        }, {
            opcode: 'isImageSmoothingEnabled',
            type: type.BlockType.BOOLEAN,
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                return ctx.imageSmoothingEnabled;
            }
        }, {
            opcode: 'beginPath',
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.beginPath();
            }
        }, {
            opcode: 'closePath',
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.beginPath();
            }
        }, {
            opcode: 'path',
            branchCount: 1,
            func: (args, util) => {
                const ctx = this.manager.getContext(this.currentId);
                if (!util.thread.isBeginPath) {
                    ctx.beginPath();
                    util.thread.isBeginPath = true;
                    util.startBranch(1, true);
                } else {
                    ctx.closePath();
                    delete util.thread.isBeginPath;
                }
            }
        }, {
            opcode: 'apply',
            func: (args, util) => {
                this.manager.stampOnStage(this.currentId);
            }
        }, {
            opcode: 'clearRect',
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                W: {
                    type: type.ParameterType.NUMBER,
                    default: '480'
                }, 
                H: {
                    type: type.ParameterType.NUMBER,
                    default: '360'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.clearRect(Cast.toNumber(args.X), Cast.toNumber(args.Y), Cast.toNumber(args.W), Cast.toNumber(args.H));
            }
        }, {
            opcode: 'strokeRect',
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                W: {
                    type: type.ParameterType.NUMBER,
                    default: '100'
                }, 
                H: {
                    type: type.ParameterType.NUMBER,
                    default: '100'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.strokeRect(Cast.toNumber(args.X), Cast.toNumber(args.Y), Cast.toNumber(args.W), Cast.toNumber(args.H));
            }
        }, {
            opcode: 'fillRect',
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                W: {
                    type: type.ParameterType.NUMBER,
                    default: '100'
                }, 
                H: {
                    type: type.ParameterType.NUMBER,
                    default: '100'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.fillRect(Cast.toNumber(args.X), Cast.toNumber(args.Y), Cast.toNumber(args.W), Cast.toNumber(args.H));
            }
        } , {
            opcode: 'fillText',
            param: {
                TEXT: {
                    type: type.ParameterType.STRING,
                    default: 'hello raphael!'
                },
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.fillText(args.TEXT, Cast.toNumber(args.X), Cast.toNumber(args.Y));
            }
        }, {
            opcode: 'strokeText',
            param: {
                TEXT: {
                    type: type.ParameterType.STRING,
                    default: 'hello raphael!'
                },
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.strokeText(args.TEXT, Cast.toNumber(args.X), Cast.toNumber(args.Y));
            }
        }, {
            opcode: 'gradient',
            type: type.BlockType.REPORTER,
            param: {
                COLOR1: {
                    type: type.ParameterType.COLOR,
                    default: '#4c97ff'
                },
                COLOR2: {
                    type: type.ParameterType.COLOR,
                    default: '#ffffff'
                },
                PROPORTION: {
                    type: type.ParameterType.NUMBER,
                    default: 0.5
                }
            },
            func: (args) => {
                const c1 = args.COLOR1.trim().startsWith('[') ? JSON.parse(args.COLOR1) : args.COLOR1;
                const c2 = args.COLOR2.trim().startsWith('[') ? JSON.parse(args.COLOR2) : args.COLOR2;
                return JSON.stringify([c1, c2, Cast.toNumber(args.PROPORTION)]);
            }
        } , {
            opcode: 'createLinearGradient',
            type: type.BlockType.REPORTER,
            param: {
                X0: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y0: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                X1: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y1: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }, 
                GRADIENT: {
                    type: type.ParameterType.COLOR,
                    default: '#4c97ff'
                }
            },
            func: (args) => {
                const gradient = args.GRADIENT.trim().startsWith('[') ? JSON.parse(args.GRADIENT) : [args.GRADIENT, args.GRADIENT, 0];
                const flattened = flatGradient(gradient);
                return JSON.stringify({
                    type: 'linear',
                    x0: Math.max(0, Cast.toNumber(args.X0)),
                    y0: Math.max(0, Cast.toNumber(args.Y0)),
                    x1: Math.max(0, Cast.toNumber(args.X1)),
                    y1: Math.max(0, Cast.toNumber(args.Y1)),
                    gradient: flattened
                });
            }
        }, {
            opcode: 'createRadialGradient',
            type: type.BlockType.REPORTER,
            param: {
                X0: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y0: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                R0: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                X1: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y1: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                R1: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                GRADIENT: {
                    type: type.ParameterType.COLOR,
                    default: '#4c97ff'
                }
            },
            func: (args) => {
                const gradient = args.GRADIENT.trim().startsWith('[') ? JSON.parse(args.GRADIENT) : [args.GRADIENT, args.GRADIENT, 0];
                const flattened = flatGradient(gradient);
                return JSON.stringify({
                    type: 'radial',
                    x0: Math.max(0, Cast.toNumber(args.X0)),
                    y0: Math.max(0, Cast.toNumber(args.Y0)),
                    r0: Math.max(0, Cast.toNumber(args.R0)),
                    x1: Math.max(0, Cast.toNumber(args.X1)),
                    y1: Math.max(0, Cast.toNumber(args.Y1)),
                    r1: Math.max(0, Cast.toNumber(args.R1)),
                    gradient: flattened
                });
            }
        }, {
            opcode: 'createPattern',
            type: type.BlockType.REPORTER,
            param: {
                NAME: {
                    type: type.ParameterType.STRING,
                    default: 'pic',
                },
                REPETITION: {
                    type: type.ParameterType.STRING,
                    default: 'repeat',
                    menu: this.makeMenuFromArray([
                        'repeat',
                        'repeat-x',
                        'repeat-y',
                        'no-repeat'])
                }
            },
            func: (args) => {
                // @todo
            }
        } , {
            opcode: 'moveTo',
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.moveTo(Cast.toNumber(args.X), Cast.toNumber(args.Y));
            }
        }, {
            opcode: 'lineTo',
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.lineTo(Cast.toNumber(args.X), Cast.toNumber(args.Y));
            }
        }, {
            opcode: 'bezierCurveTo',
            param: {
                CP1X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                CP1Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                CP2X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                CP2Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.bezierCurveTo(Cast.toNumber(args.CP1X), Cast.toNumber(args.CP1Y), Cast.toNumber(args.CP2X), Cast.toNumber(args.CP2Y), Cast.toNumber(args.X), Cast.toNumber(args.Y));
            }
        } , {
            opcode: 'quadraticCurveTo',
            param: {
                CPX: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                CPY: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.quadraticCurveTo(Cast.toNumber(args.CPX), Cast.toNumber(args.CPY), Cast.toNumber(args.X), Cast.toNumber(args.Y));
            }
        }, {
            opcode: 'arc',
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                RADIUS: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                START_ANGLE: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                END_ANGLE: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                ANTICLOCKWISE: {
                    type: type.ParameterType.STRING,
                    default: 'false',
                    menu: this.makeMenuFromArray([
                        'false',
                        'true'
                        ])
                },
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.arc(Cast.toNumber(args.X), Cast.toNumber(args.Y), Cast.toNumber(args.RADIUS),Cast.toNumber(args.START_ANGLE), Cast.toNumber(args.END_ANGLE), args.ANTICLOCKWISE === 'true');
            }
        }, {
            opcode: 'arcTo',
            param: {
                X1: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y1: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                X2: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y2: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                RADIUS: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.arcTo(Cast.toNumber(args.X1), Cast.toNumber(args.Y1), Cast.toNumber(args.X2), Cast.toNumber(args.Y2), Cast.toNumber(args.RADIUS));
            }
        }, {
            opcode: 'ellipse',
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                RADIUS_X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                RADIUS_Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                ROTATION: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                START_ANGLE: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                END_ANGLE: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                ANTICLOSEWISE: {
                    type: type.ParameterType.STRING,
                    default: 'false',
                    menu: this.makeMenuFromArray([
                        'false',
                        'true'
                        ])
                },
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.ellipse(Cast.toNumber(args.X), Cast.toNumber(args.Y), Cast.toNumber(args.RADIUS_X), Cast.toNumber(args.RADIUS_Y), Cast.toNumber(args.ROTATION), Cast.toNumber(args.START_ANGLE), Cast.toNumber(args.END_ANGLE), args.ANTICLOSEWISE === 'true');
            }
        } , {
            opcode: 'rect',
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                W: {
                    type: type.ParameterType.NUMBER,
                    default: '100'
                },
                H: {
                    type: type.ParameterType.NUMBER,
                    default: '100'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.rect(Cast.toNumber(args.X), Cast.toNumber(args.Y), Cast.toNumber(args.W), Cast.toNumber(args.H));
            }
        }, {
            opcode: 'fill',
            param: {
                FILLRULE: {
                    type: type.ParameterType.STRING,
                    default: 'nonzero',
                    menu: this.makeMenuFromArray([
                        'nonzero',
                        'evenodd'
                        ])
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.fill(args.FILLRULE);
            }
        }, {
            opcode: 'stroke',
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.stroke();
            }
        }, {
            opcode: 'clip',
            param: {
                FILLRULE: {
                    type: type.ParameterType.STRING,
                    default: 'nonzero',
                    menu: this.makeMenuFromArray([
                        'nonzero',
                        'evenodd'
                        ])
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.clip(args.FILLRULE);
            }
        } , {
            opcode: 'isPointInPath',
            type: type.BlockType.BOOLEAN,
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                FILLRULE: {
                    type: type.ParameterType.STRING,
                    default: 'nonzero',
                    menu: this.makeMenuFromArray([
                        'nonzero',
                        'evenodd'
                        ])
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                return ctx.isPointInPath(Cast.toNumber(args.X), Cast.toNumber(args.Y), args.FILLRULE);
            }
        }, {
            opcode: 'isPointInStroke',
            type: type.BlockType.BOOLEAN,
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                return ctx.isPointInStroke(Cast.toNumber(args.X), Cast.toNumber(args.Y));
            }
        }, {
            opcode: 'rotate',
            param: {
                ANGLE: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.rotate(Cast.toNumber(args.ANGLE));
            }
        }, {
            opcode: 'scale',
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.scale(Cast.toNumber(args.X), Cast.toNumber(args.Y));
            }
        } , {
            opcode: 'translate',
            param: {
                X: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                Y: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.translate(Cast.toNumber(args.X), Cast.toNumber(args.Y));
            }
        }, {
            opcode: 'transform',
            param: {
                A: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                B: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                C: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                D: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                E: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                F: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.transform(Cast.toNumber(args.A), Cast.toNumber(args.B), Cast.toNumber(args.C), Cast.toNumber(args.D), Cast.toNumber(args.E), Cast.toNumber(args.F));
            }
        }, {
            opcode: 'setTransform',
            param: {
                A: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                B: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                C: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                D: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                E: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                },
                F: {
                    type: type.ParameterType.NUMBER,
                    default: '0'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.setTransform(Cast.toNumber(args.A), Cast.toNumber(args.B), Cast.toNumber(args.C), Cast.toNumber(args.D), Cast.toNumber(args.E), Cast.toNumber(args.F));
            }
        }, {
            opcode: 'resetTransform',
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.resetTransform();
            }
        }, {
            opcode: 'setGlobalCompositeOperation',
            param: {
                CO: {
                    type: type.ParameterType.STRING,
                    default: 'source-over'
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.globalCompositeOperation = args.CO;
            }
        }, {
            opcode: 'loadImage',
            param: {
                TYPE: {
                    type: type.ParameterType.STRING,
                    default: 'md5',
                    menu: this.makeMenuFromArray([
                        'md5',
                        'artboard',
                        'blob'])
                },
                CONTENT: {
                    type: type.ParameterType.STRING,
                    default: '// todo'
                },
                NAME: {
                    type: type.ParameterType.STRING,
                    default: 'name',
                }
            },
            func: (args) => {
                
            }
        }, {
            opcode: 'drawImage',
            param: {
                DX: {
                    type: type.ParameterType.NUMBER,
                    default: '0',
                },
                DY: {
                    type: type.ParameterType.NUMBER,
                    default: '0',
                },
                NAME: {
                    type: type.ParameterType.STRING,
                    default: 'pic',
                }
            },
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
            }
        }, {
            opcode: 'save',
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.save();
            }
        }, {
            opcode: 'restore',
            func: (args) => {
                const ctx = this.manager.getContext(this.currentId);
                ctx.restore();
            }
        }]);
    }
    
    onUninit () {
        api.removeCategory('shiki.raphael.category');
    }
}

export default Raphael;
