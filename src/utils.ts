/**
 * Escapes (with \) any markdown reserved character on the string and
 * returns the escaped string
 * @param str - A markdown text to be escaped
 */
export function markdownEscape(str: string): string {
    const replacements: Array<[ RegExp, string ]>= [
        [ /\*/g, '\\*' ],
        [ /#/g, '\\#' ],
        [ /\//g, '\\/' ],
        [ /\(/g, '\\(' ],
        [ /\)/g, '\\)' ],
        [ /\[/g, '\\[' ],
        [ /\]/g, '\\]' ],
        [ /\</g, '&lt;' ],
        [ /\>/g, '&gt;' ],
        [ /_/g, '\\_' ],
    ]
    return replacements.reduce((str, [ find, replace ]) => str.replace(find, replace), str)
}
