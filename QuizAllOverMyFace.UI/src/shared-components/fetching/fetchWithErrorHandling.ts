import { messageError, messageConfirm } from "../material-ui-modals"

export interface fetchWithErrorHandlingProps {
    /**
     * inline function that will fetch data and return a Response
     */
    fetchCall: () => Promise<Response> | Response
    /**
     * option array that will contain property names from a json error that can be used as a error message content
     */
    errorMessageContentProperties?: string[]
    /**
     * option array that will contain property names from a json error that can be used as a error message title
     */
    errorMessageTitleProperties?: string[]
    /**
     * function that will be called when the api returned any status different than 2** and 401 (error) so you can
     * handle this error yourself an possibly access custom properties from errorResponseObjectFromJson
     * @returns if you return true, you are requesting that no UI is to be shown with the error (because you might show it in your code, or it is not necessary at all)
     */
    serverErrorCustomHandling?: (errorResponseObjectFromJson: any) => Promise<boolean | undefined>
    /**
     * function that will be called when the api call throws any other error not handled by serverErrorCustomHandling. This might be for any reason.
     * @returns if you return true, you are requesting that no UI is to be shown with the error (because you might show it in your code, or it is not necessary at all)
     */
    errorCustomHandling?: (errorReason: any) => Promise<boolean | undefined>
}

/**
 * Use this to call apis with proper error handling and visual feedback
 * @param param0 props in fetchWithErrorHandlingProps
 * @example
 * const response = await fetchWithErrorHandling(() => window.fetch(url, options))
 */
export async function fetchWithErrorHandling({
    fetchCall,
    serverErrorCustomHandling,
    errorMessageContentProperties,
    errorMessageTitleProperties }: fetchWithErrorHandlingProps): Promise<Response> {
    try {
        const response = await fetchCall()
        if (response) {
            if (response.status === 204) {
                // There's no content with a 204 response, so although it's classed as successful,
                // there is no text that comes back on the reponse object, so we just create a new
                // Response.
                return new Response()
            } else if (response.status === 401) {
                return notAuthenticatedError()
            } else if (response.status.toString()[0] !== '2') {
                try {
                    const textResponse = await response.text()
                    try {
                        try {
                            var jsonResponse = JSON.parse(textResponse)
                        } catch (error) {
                            return errorHandler(textResponse)
                        }

                        if (serverErrorCustomHandling && (await serverErrorCustomHandling(jsonResponse)) === true) {
                            return Promise.reject(jsonResponse)
                        }
                        const messageContent = getFirstValidProperty(jsonResponse, errorMessageContentProperties) || textResponse
                        const messageTitle = getFirstValidProperty(jsonResponse, errorMessageTitleProperties) || 'Error'

                        return errorHandler(messageContent, messageTitle)

                    } catch (error) {
                        return errorHandler(processError(error))

                    }
                } catch (error) {
                    return errorHandler(processError(error))

                }
            }
        }
        return response
    } catch (errorResponse) {
        if (serverErrorCustomHandling && (await serverErrorCustomHandling(errorResponse)) === true) {
            return Promise.reject(errorResponse)
        }

        if (!!errorResponse && !!errorResponse.response && errorResponse.response.status === '401') {
            return notAuthenticatedError()
        } else {
            return errorHandler(`Error with server communication: ${processError(errorResponse)}`)
        }

    }
}

function getFirstValidProperty<T extends Object>(obj: T, propertyNames?: string[]) {
    if (!propertyNames) {
        return undefined
    }
    for (const property of propertyNames) {
        const value = (obj as any)[property]
        if (value) {
            return value
        }
    }
}

const processError = (error: any) => {
    if (typeof error === 'object') {
        if (!!error.message) {
            return error.message + (error.stack ? '; Stack: ' + error.stack : '')
        }
        return JSON.stringify(error).replace(/(?:\\[rn])+/g, "\n")
    } else {
        return error
    }
}


const errorHandler = (content: any, title?: string) => {
    if (!content) {
        content = "Unexpected behavior from application server."
    }
    messageError({ content: processError(content), title })
    return Promise.reject(content)
}

const notAuthenticatedError = () => {

    messageConfirm({ content: "User is not authenticated. Would you like to reload the page?", title: 'Authentication' }).then((confirmed) => {
        if (confirmed) {
            window.location.reload()
        }
    })

    return Promise.reject("User is not authenticated")
}