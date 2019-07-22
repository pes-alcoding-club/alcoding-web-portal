// This is a sample function to send as prop to the runFunction or submitFunction

/**
 * 
 * @param {Object} data Object that will be passed to your function (runFunction or submitFunction)
 * @param {string} data.content Code from the editor
 * @param {string} data.language Language used
 * @param {boolean} data.customInput TRUE if the user selected custom input and FALSE otherwise
 * @param {string} data.stdin stdin for the submission if customInput is TRUE and '' if customInput is FALSE
 * @param {boolean} data.submit TRUE if user wants to submit code and FALSE if user wants to run code
 */

export default function sampleFunction(data) {
    
   console.log(
       'Content: '+ data['content'],
       '\nLanguage: '+ data['language'],
       '\nCustomInput: '+ data['customInput'],
       '\nstdin: ' + data['stdin'],
       '\nSubmit Code: ' + data['submit']
   )

}