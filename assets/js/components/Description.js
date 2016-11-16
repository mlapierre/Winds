import React from 'react'

var Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities(),
    normalizeWhitespace = require('normalize-html-whitespace'),
    HtmlToReactParser = require('html-to-react').Parser,
    htmlToReactParser = new HtmlToReactParser()

const Content = html => {
	htmlToReactParser.parse(html)
}
//React.renderToStaticMarkup(htmlToReactParser.parse(props.children))

export default props => (
	<div className="description">
		<Content html={entities.decode(props.children)} />
	</div>
)
