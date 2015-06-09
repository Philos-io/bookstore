/* */ 
var annotations_1 = require("./annotations");
var view_1 = require("./view");
var visibility_1 = require("./visibility");
var di_1 = require("./di");
var decorators_1 = require("../../util/decorators");
exports.Component = decorators_1.makeDecorator(annotations_1.ComponentAnnotation);
exports.Directive = decorators_1.makeDecorator(annotations_1.DirectiveAnnotation);
exports.View = decorators_1.makeDecorator(view_1.ViewAnnotation);
exports.Self = decorators_1.makeParamDecorator(visibility_1.SelfAnnotation);
exports.Parent = decorators_1.makeParamDecorator(visibility_1.ParentAnnotation);
exports.Ancestor = decorators_1.makeParamDecorator(visibility_1.AncestorAnnotation);
exports.Unbounded = decorators_1.makeParamDecorator(visibility_1.UnboundedAnnotation);
exports.Attribute = decorators_1.makeParamDecorator(di_1.AttributeAnnotation);
exports.Query = decorators_1.makeParamDecorator(di_1.QueryAnnotation);
exports.__esModule = true;
