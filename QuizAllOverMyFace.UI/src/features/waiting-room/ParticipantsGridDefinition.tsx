import React from 'react';
import { Column } from 'material-table';
import { Chip, Typography, Link } from '@material-ui/core';
import { Round, QuizTeam } from '../../client/backendclient'
import { createDynamicLinkPath } from '../../helpers/helperFunctions';

export const ParticipantsGridDefinition: Column<QuizTeam>[] = [
  {
    title: 'Team Name',
    field: 'teamName',
    // render: (data: Round) => {
    //     return (
    //       <span>
    //         <Typography>
    //           <Link href={createDynamicLinkPath('orders', data.orderId!)}>{data.orderId}</Link>
    //         </Typography>
    //       </span>
    //     );
    //   }
  },
  {
    title: 'Points',
    field: 'points'
  },
  // Try to render a status for each team
];
