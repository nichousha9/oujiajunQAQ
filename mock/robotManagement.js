
import mockjs from 'mockjs';

export default {
  'POST /robotManagement/qryrobotlist': (req, res) => {
    const { pageNum, pageSize } = req;
    res.send(
      mockjs.mock({
        status: 'OK',
        msg: 'success',
        data: {
          'list|30': [
            {
              'key|+1': 1,
              'name|1': ['机器人一号', '机器人二号', '机器人三号', '机器人四号', '机器人五号'],
              'age|1': ['12345', '54321'],
              'address|1': ['我是一号', '我是二号', '我是三号', '我是四号', '我是五号'],
            },
          ],
        },
        page: { total: 30, pageSize: pageSize || 10, pageNum: pageNum || 1 },
      }),
    );
  },

  'POST /robotManagement/qryrepository': (req, res) => {
    const { pageNum, pageSize } = req;
    res.send(
      mockjs.mock({
        status: 'OK',
        msg: 'success',
        data: {
          'list|10': [
            {
              'knowledgeId|+1': 1,
              'knowledgeName|1': [
                '机器人一号',
                '机器人二号',
                '机器人三号',
                '机器人四号',
                '机器人五号',
              ],
              'explain|1': ['我是一号', '我是二号', '我是三号', '我是四号', '我是五号'],
            },
          ],
        },
        page: { total: 30, pageSize: pageSize || 10, pageNum: pageNum || 1 },
      }),
    );
  },

  'POST /robotManagement/qryscene': (req, res) => {
    const { pageNum, pageSize } = req;
    res.send(
      mockjs.mock({
        status: 'OK',
        msg: 'success',
        data: {
          'list|10': [
            {
              'sceneId|+1': 1,
              'sceneName|1': ['机器人一号', '机器人二号', '机器人三号', '机器人四号', '机器人五号'],
              'sceneSpeed|1': ['我是一号', '我是二号', '我是三号', '我是四号', '我是五号'],
            },
          ],
        },
        page: { total: 30, pageSize: pageSize || 10, pageNum: pageNum || 1 },
      }),
    );
  },
};