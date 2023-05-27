import { Input, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import CarTable from '@/app/admin/component/Cars/TableList';
import { AddCar } from '@/app/admin/component/Cars/add-cars';

export const Cars = () => {
  return (
    <Flex
      css={{
        mt: '$5',
        px: '$6',
        '@sm': {
          mt: '$10',
          px: '$16',
        },
      }}
      justify={'center'}
      direction={'column'}
    >

      <Flex>
        <Flex
          direction={'row'}
          css={{
            gap: '$6',
            marginTop: '$15',
          }}
          wrap={'wrap'}
        >
          <AddCar />
        </Flex>
      </Flex>
      <CarTable />
    </Flex>
  );
};
