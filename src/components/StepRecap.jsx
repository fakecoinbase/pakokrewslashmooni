import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Box } from '@material-ui/core';
import { Button, Countdown, Info, IconCoin, Checkbox, Link, Modal } from '@aragon/ui'

import Terms from '../components/Terms';
import Loader from '../components/Loader';
import PaymentOrderRecap from '../components/PaymentOrderRecap';

import { getPaymentOrder, getOrderErrors } from '../redux/payment/selectors';

function StepRecap({ onComplete }) {
  const paymentOrder = useSelector(getPaymentOrder);
  const orderErrors = useSelector(getOrderErrors);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOpened, setTermsOpened] = useState(false);

  const now = new Date();
  const orderExpireDate = new Date(paymentOrder.bityOrder.timestamp_price_guaranteed);
  
  if(orderExpireDate < now) {
    return (
      <Box width={1}>
        <Info title="Order expired" mode="error">
          The order you made has expired. Please create a new one.
        </Info>
      </Box>
    )
  }

  if(orderErrors) {
    return (
      <Box width={1}>
        <Info title="Order error" mode="error">
          {orderErrors.map(error => (
            <Box key={error.code}><b>{error.code}</b> {error.message}</Box>
          ))}
        </Info>
      </Box>
    );
  }

  return (
    <Box width={1}>
      <Box mt={2}/>
      {
        paymentOrder ?
          <>
            <PaymentOrderRecap paymentOrder={paymentOrder} />
            <Box pt={2}>
              <Info title="Price guaranteed until" mode="warning">
                <Countdown end={orderExpireDate} />
              </Info>
            </Box>
            <Box py={2} display="flex" justifyContent="center">
              <label>
                <Checkbox
                  checked={termsAccepted}
                  onChange={setTermsAccepted}
                />
                I agree with the <Link onClick={() => setTermsOpened(true)}>terms of service</Link>
              </label>
              <Modal visible={termsOpened} onClose={() => setTermsOpened(false)}>
                <Box>
                  <Terms />
                </Box>
              </Modal>
            </Box>
            <Button mode="strong" onClick={onComplete} wide icon={<IconCoin />} disabled={!termsAccepted} label="Send payment" />
          </>
          :
          <Loader text="Creating order ..." />
      }
    </Box>
  )
}

export default StepRecap;
