import { Configs } from '../models';
import { configIdByDefault } from '../models/Configs';
import { debugEngages, debugRequest, debugResponse } from '../utils/debuggers';
import { fetchWorkersApi } from './utils';

export const send = async (req, res) => {
  debugRequest(debugEngages, req);

  const { customers, email, user, engageMessageId } = req.body;

  const config = await Configs.findById(configIdByDefault);

  if (!config) {
    debugResponse(debugEngages, req, JSON.stringify('Please set up amazon config first'));

    return res.status(500).send('Please set up amazon config first');
  }

  try {
    await fetchWorkersApi({
      path: '/send',
      method: 'post',
      body: {
        customers,
        email,
        engageMessageId,
        user,
      },
    });

    debugResponse(debugEngages, req, 'true');

    return res.json(true);
  } catch (e) {
    debugResponse(debugEngages, req, JSON.stringify(e));

    return res.status(500).send(e);
  }
};
