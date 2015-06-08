module.exports = function(config){
  config.set({

    basePath : './',

    files : [],

    autoWatch : true,

    frameworks: ['jasmine', 'mocha'],

    browsers : ['Chrome'], // you can list all browsers you want to be test

    plugins : [],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};