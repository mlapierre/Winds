import React from 'react'

var Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities(),
    normalizeWhitespace = require('normalize-html-whitespace'),
    HtmlToReactParser = require('html-to-react').Parser,
    htmlToReactParser = new HtmlToReactParser()

const safelyRenderHtml = html => {
	return htmlToReactParser.parse(
		'<div className=\"article-content-wrapper\">' + 
			entities.decode(html) + 
		'</div>')
}

export default props => {
	if (!props.children) return null
	return (
		<div className="description">
	    	{safelyRenderHtml(props.children)}
	    </div>			
	)
}
