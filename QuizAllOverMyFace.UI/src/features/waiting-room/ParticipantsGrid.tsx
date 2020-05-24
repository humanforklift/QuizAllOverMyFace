import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { TableComponent } from "../../shared-components/material-ui-table-component"
import { ParticipantsGridDefinition } from './ParticipantsGridDefinition';
import { WaitingRoomStoreContext } from './WaitingRoomStore'

const ParticipantsGrid = () => {
    const waitingRoomStore = useContext(WaitingRoomStoreContext)

    return (
        <>
                            <p>The quiz Id is {waitingRoomStore.quiz.id}</p>
            {       
                // serviceStore.hasOrders && 
                <TableComponent
                    columns={ParticipantsGridDefinition}
                    data={waitingRoomStore.quiz.teams!}
                    title={'Teams'}

                    options={{
                        exportButton: false,
                        search: false
                    }}
                />
            } 
        </>
    );
};

export default observer(ParticipantsGrid)