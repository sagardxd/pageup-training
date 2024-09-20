export const truckData = {
  trucks: [
    {
      truckId: 'T001',
      capacity: 10,
      availableSpace: 8,
      origin: 'JBP',
      destination: 'MUM',
      route: [
        {
          from: 'JBP',
          to: 'Indore',
        },
        {
          from: 'Indore',
          to: 'Mumbai',
        },
      ],
      driver: {
        name: 'Rajesh',
        contact: '9876543210',
      },
    },
    {
      truckId: 'T002',
      capacity: 10,
      availableSpace: 6,
      origin: 'JBP',
      destination: 'BNC',
      route: [
        {
          from: 'JBP',
          to: 'Bangalore',
        },
      ],
      driver: {
        name: 'Sita',
        contact: '9123456789',
      },
    },
    {
      truckId: 'T003',
      capacity: 10,
      availableSpace: 5,
      origin: 'JBP',
      destination: 'PUNE',
      route: [
        {
          from: 'JBP',
          to: 'Solapur',
        },
        {
          from: 'Solapur',
          to: 'Pune',
        },
      ],
      driver: {
        name: 'Amit',
        contact: '9988776655',
      },
    },
  ],
};
