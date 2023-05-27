import React, { useState } from 'react';
import { Button, Divider, Input, Modal, Text } from '@nextui-org/react';
import Grid from '@mui/material/Grid';

export const AddCar = () => {
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log('closed');
  };

  const [marque, setMarque] = useState('');
  const [models, setModels] = useState('');
  const [matricule, setMatricule] = useState('');
  const [year, setYear] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [color, setColor] = useState('');
  const [type, setType] = useState('');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState('');

  const resetFields = () => {
    setMarque('');
    setModels('');
    setMatricule('');
    setYear('');
    setKilometers('');
    setColor('');
    setType('');
    setCost('');
    setStatus('');
  };

  return (
    <div>
      <Button auto onClick={handler}>
        Add Car
      </Button>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="600px"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header css={{ justifyContent: 'start' }}>
          <Text id="modal-title" h4>
            Add new Car
          </Text>
        </Modal.Header>
        <Divider css={{ my: '$5' }} />
        <Modal.Body css={{ py: '$10' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Input
                label="Marque"
                bordered
                clearable
                fullWidth
                size="lg"
                placeholder="Marque"
                value={marque}
                onChange={(e) => setMarque(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Models"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Models"
                value={models}
                onChange={(e) => setModels(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Matricule"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Matricule"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Year"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Kilometers"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Kilometers"
                value={kilometers}
                onChange={(e) => setKilometers(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Color"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Type"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Cost"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </Grid>
          </Grid>
        </Modal.Body>
        <Divider css={{ my: '$5' }} />
        <Modal.Footer>
          <Button auto onClick={resetFields}>
            Reset
          </Button>
          <Button auto onClick={closeHandler}>
            Add Car
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
