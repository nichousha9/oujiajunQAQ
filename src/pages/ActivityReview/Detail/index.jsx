import React, { Component } from 'react';
import router from 'umi/router';
import { Card, Button } from 'antd';
import ReviewForm from './components/ReviewForm';
// import TaskCycle from './components/TaskCycle';
import StepList from './components/StepList';

class ReviewDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Card
        extra={
          <Button
            type="primary"
            size="small"
            onClick={() => {
              // 返回列表页
              router.goBack();
            }}
          >
            返回
          </Button>
        }
      >
        <ReviewForm />
        {/* <TaskCycle /> */}
        <StepList />
      </Card>
    );
  }
}

export default ReviewDetail;
