# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!-- ## [X.Y.Z] - YYYY-MM-DD -->

<!-- ### Added -->
<!-- ### Changed -->
<!-- ### Deprecated -->
<!-- ### Removed -->
<!-- ### Fixed -->
<!-- ### Security -->

<!-- ## Unreleased -->

## Unreleased

### [0.5.0] - 2023-10-06
- Property to force all attributes to be wrapped in quotes - `quotedAttributes`.

## [0.4.0] - 2022-06-29

### Added
- Support JSX variables.
- Transform any unknown identifier to a callable expression.


## [0.3.1] - 2022-06-09

### Fixed
- Translate JSX tags (eg. MyImage) to execution of a function if it is possible

## [0.3.0] - 2021-03-09

### Added
- Add 'for' to the global attributes.


## [0.2.0] - 2020-08-03

### Added
-If a tag refers to a function that's first argument isn't a String Literal try to convert the tag to a Call Expression inside a Template Element.

## [0.1.0] - 2020-08-01

### Added
- Add an option to set a custom function name for define Custom Element.
### Changed
- Convert JSX String Literal properties to the values of attributes on the specified elements.


## [0.0.0] - 2020-04-16

### Added
- Create babel-plugin-transform-jsx-to-tt project.
