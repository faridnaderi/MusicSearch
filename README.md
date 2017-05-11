# Music Search, Sample front-end work
Music search : is a sample website that gives me opportunity to give better understanding about my skills to Compucorp.

The requested tasks are :

* Your solution must follow the design as closely as possible
* Write tests for you code
* Include a build process
* Do not use any scaffolding tool, application boilerplate or seed project
* Do not use any CSS framework (i.e. Bootstrap, Foundation, or similar)
* Use a CSS preprocessor
* The site must work fine with the latest version of Chrome, Firefox, Safari, Microsoft Edge and IE11
* Include a README file in which you explain your solution
 
## Application struction
The project is not large therefore i ended up with following structure

```
Assets
----| Images
----| Fonts
----| Scripts.min.js
----| StyleSheet.min.css
Views
----| details-modal.html
Src ( holds all SCSS and JS source files )
----| JS
---------| Directives
---------| details_modal_directive.js
---------| Controllers
--------------| banner_ctrl.js
--------------| search_ctrl.js
---------| filters.js
----| SCSS
---------| _banner.scss
---------| _footer.scss
---------| _layout.scss
---------| _mixins.scss
---------| _modal.scss
---------| _search.scss
---------| _typography.scss
----| scripts.js
----| stylesheet.css
bundleconfig.json ( Uses to minify javascripts into one file )
compilerconfig.json ( Uses to minify and compile SCSS files to one css file )
index.html
README.md
```
