const mockOrders = {
  'ORD-1001': { ownerEmail: 'demo@agentlab.dev', status: 'shipped', eta: '2026-06-20', amount: 129 },
  'ORD-2002': { ownerEmail: 'demo@agentlab.dev', status: 'processing', eta: '2026-06-23', amount: 89 }
};

function buildTrace(userRequest, steps) {
  return {
    user_request: userRequest,
    expected_tools: steps.filter((s) => s.tool).map((s) => s.tool),
    steps
  };
}

export function simulateWorkflow({ type, userRequest, orderId, confirmed = false, userEmail = 'demo@agentlab.dev' }) {
  const steps = [{ action: 'understand_request', result: `Workflow type: ${type}` }];

  if (/ignore previous|system prompt|api key|all users/i.test(userRequest || '')) {
    steps.push({ action: 'safety_gate', result: 'Blocked prompt-injection or private-data request.' });
    steps.push({ action: 'final_response', result: 'I cannot help with bypassing instructions or exposing private information.' });
    return buildTrace(userRequest, steps);
  }

  if (type === 'order_status') {
    const order = mockOrders[orderId];
    steps.push({ action: 'call_api', tool: 'getOrderStatus', input: { orderId }, result: order || null });
    if (!order) steps.push({ action: 'final_response', result: 'I could not find that order. Please check the order ID.' });
    else if (order.ownerEmail !== userEmail) steps.push({ action: 'final_response', result: 'I cannot disclose order details for another account.' });
    else steps.push({ action: 'final_response', result: `Order ${orderId} is ${order.status}. ETA: ${order.eta}.` });
    return buildTrace(userRequest, steps);
  }

  if (type === 'refund') {
    const order = mockOrders[orderId];
    steps.push({ action: 'call_api', tool: 'getOrderStatus', input: { orderId }, result: order || null });
    if (!order) {
      steps.push({ action: 'final_response', result: 'Refund cannot be started because the order does not exist.' });
      return buildTrace(userRequest, steps);
    }
    if (!confirmed) {
      steps.push({ action: 'confirmation_gate', result: 'Refund is sensitive. Ask user for explicit confirmation before proceeding.' });
      steps.push({ action: 'final_response', result: `Please confirm you want to refund order ${orderId} for $${order.amount}.` });
      return buildTrace(userRequest, steps);
    }
    steps.push({ action: 'call_api', tool: 'createRefund', input: { orderId, amount: order.amount }, result: { refundId: 'RF-9912', status: 'created' } });
    steps.push({ action: 'final_response', result: `Refund created for order ${orderId}. Refund ID: RF-9912.` });
    return buildTrace(userRequest, steps);
  }

  if (type === 'support_ticket') {
    steps.push({ action: 'call_api', tool: 'createTicket', input: { issue: userRequest, priority: 'normal' }, result: { ticketId: 'TCK-4501' } });
    steps.push({ action: 'final_response', result: 'Support ticket TCK-4501 has been created.' });
    return buildTrace(userRequest, steps);
  }

  steps.push({ action: 'final_response', result: 'Unknown workflow type.' });
  return buildTrace(userRequest, steps);
}
