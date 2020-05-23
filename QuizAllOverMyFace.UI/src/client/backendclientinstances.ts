//import { IotdevicesClient, IotdeviceCountsClient, AccountClient, UsersClient } from './backendclient'
import { QuizClient, RoundClient } from './backendclient'
import { fetchWithErrorHandling } from 'shared-components/fetching';
//import { userCacheHandler } from './auth';

const fetchObject = {
    async fetch(
        url: RequestInfo,
        init?: RequestInit | undefined
    ): Promise<Response> {
        init = init || { headers: {} };

        //const user = userCacheHandler.get();
        // if (user && user.token) {
        //     (init.headers as any).Authorization = 'Bearer ' + user.token
        // }
        

        return fetchWithErrorHandling({
            fetchCall: () => window.fetch(url, init),
            errorMessageContentProperties: ['Message'],
            errorMessageTitleProperties: ['Title']
        });
    }
};

const url = process.env.REACT_APP_API_BASE_URL || undefined

// export const deviceClient = new IotdevicesClient(url, fetchObject);
// export const deviceCountClient = new IotdeviceCountsClient(url, fetchObject);
// export const accountClient = new AccountClient(url, fetchObject);
// export const usersClient = new UsersClient(url, fetchObject);
export const quizClient = new QuizClient(url, fetchObject);
export const roundClient = new RoundClient(url, fetchObject);