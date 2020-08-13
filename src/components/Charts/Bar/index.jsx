import { Axis, Chart, Geom, Tooltip, Legend } from 'bizcharts';
import React, { Component } from 'react';
import Debounce from 'lodash.debounce';
import autoHeight from '../autoHeight';
import styles from '../index.less';

class Bar extends Component {
  state = {
    autoHideXLabels: false,
  };

  root = undefined;

  node = undefined;

  chart = undefined;

  resize = Debounce(() => {
    if (!this.node || !this.node.parentNode) {
      return;
    }

    const canvasWidth = this.node.parentNode.clientWidth;
    const { data = [], autoLabel = true } = this.props;

    if (!autoLabel) {
      return;
    }

    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true,
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false,
      });
    }
  }, 500);

  componentDidMount() {
    window.addEventListener('resize', this.resize, {
      passive: true,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  handleRoot = n => {
    this.root = n;
  };

  handleRef = n => {
    this.node = n;
  };

  render() {
    const {
      height = 1,
      title,
      forceFit = true,
      data,
      colors,
      padding,
      active,
      onClick,
    } = this.props;
    const { autoHideXLabels } = this.state;
    const scale = {
      x: {
        type: 'cat',
      },
      y: {
        min: 0,
      },
    };
    // const tooltip = [
    //   'x*y',
    //   (x, y) => ({
    //     name: x,
    //     value: y,
    //   }),
    // ];
    return (
      <div
        className={styles.chart}
        style={{
          height,
        }}
        ref={this.handleRoot}
      >
        <div ref={this.handleRef}>
          {title && (
            <h4
              style={{
                marginBottom: 20,
              }}
            >
              {title}
            </h4>
          )}
          <Chart
            scale={scale}
            height={title ? height - 41 : height}
            forceFit={forceFit}
            data={data}
            padding={padding || 'auto'}
            onPlotClick={ev => {
              const point = {
                x: ev.x,
                y: ev.y,
              };
              if (this.chart) {
                onClick(this.chart.getTooltipItems(point));
              }
            }}
            onGetG2Instance={g2Chart => {
              this.chart = g2Chart;
            }}
          >
            <Axis
              name="x"
              label={autoHideXLabels ? undefined : {}}
              tickLine={autoHideXLabels ? undefined : {}}
            />
            <Axis name="y" min={0} />
            <Legend />
            <Tooltip />
            <Geom
              type="interval"
              position="x*y"
              color={['name', colors]}
              active={active}
              adjust={[
                {
                  type: 'dodge',
                  marginRatio: 1 / 32,
                },
              ]}
            />
          </Chart>
        </div>
      </div>
    );
  }
}

export default autoHeight()(Bar);
