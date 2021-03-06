const elixir = require('laravel-elixir');


/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

// elixir.config.sourcemaps = true;

elixir(function(mix) {

	mix
	.copy('./node_modules/angular-material/angular-material.css', 'resources/assets/css/libs/')

    .copy('./resources/assets/mainapp/home/views', 'public/mainapp/')
    .copy('./resources/assets/mainapp/sell/views', 'public/mainapp/')
    .copy('./resources/assets/mainapp/common/views', 'public/mainapp/')
    .copy('./resources/assets/mainapp/common/layouts', 'public/mainapp/')

    .copy('./resources/assets/admin/home/views', 'public/admin/')
    .copy('./resources/assets/admin/template_editor/views', 'public/admin/')
    .copy('./resources/assets/admin/common/views', 'public/admin/')
    .copy('./resources/assets/admin/common/layouts', 'public/admin/')



	.copy('./node_modules/angular/angular.js', 'resources/assets/js/libs/')
	.copy('./node_modules/angular-material/angular-material.js', 'resources/assets/js/libs/')
	.copy('./node_modules/angular-ui-router/release/angular-ui-router.js', 'resources/assets/js/libs/')
	.copy('./node_modules/angular-animate/angular-animate.js', 'resources/assets/js/libs/')
	.copy('./node_modules/angular-messages/angular-messages.js', 'resources/assets/js/libs/')
	.copy('./node_modules/angular-sanitize/angular-sanitize.min.js', 'resources/assets/js/libs/')
	.copy('./node_modules/angular-aria/angular-aria.js', 'resources/assets/js/libs/');




	mix.scripts(['libs/angular.js','libs/angular-animate.js','libs/angular-aria.js','libs/angular-messages.js','libs/angular-material.js','libs/angular-ui-router.js'], 'public/js/libs/framework.js')
	.scriptsIn('./resources/assets/mainapp/','public/js/app.js');

	mix.scriptsIn('./resources/assets/admin/','public/js/admin_area.js');

	mix.sass('mainapp.scss','./resources/assets/css/mainapp/mainapp.css').styles(['libs/angular-material.css','mainapp/mainapp.css'],'public/css/mainapp.css');
    mix.sass('admin_area.scss','./resources/assets/css/admin/admin_area.css').styles(['libs/angular-material.css','admin/admin_area.css'],'public/css/admin_area.css');


});
