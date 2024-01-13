import React, { Component } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import './DashBoardStyles.css';
import { expenseUrl, initUrl } from "../../service/url";
import { setData, selectData } from '../../Redux/features/login/loginSlicer';
import { useSelector, useDispatch } from 'react-redux';
import { notifyError, notifySuccess } from "../../components/toast";
import { ServiceCall } from "../../service/config";

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const filter = [{ id: 0, day: '12 Months' , count: 365}, { id: 1, day: '6 Months', count: 365/2 }, { id: 2, day: '30 Days', count: 30 }, { id: 3, day: '7 Days', count: 7 }];

class DashBoardGraph extends Component {
  constructor() {
    super();
    this.state = {
      loading:false,
      dataPoints: [],
      message:'',
      count:365,
    };
    this.toggleDataSeries = this.toggleDataSeries.bind(this);
  }

  toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    this.chart.render();
  }

  getGraphData = async () => {
    this.setState({loading:true});
    const url = initUrl + expenseUrl.graphExpense;
    const formData = new URLSearchParams();
    formData.append('user_id',this.props.userId);

    await ServiceCall(url, formData, false)
      .then((res) => {
        console.log("res>>", res);
        if (res.responseCode === 200) {
          const reponse = res?.result
          this.setState({message:res?.message})
          this.setState({dataPoints: reponse});
          console.log('grapg??????',this.state.dataPoints)
        } else {
          notifyError(res?.message);
        }
        this.setState({loading:false});
      })
      .catch((err) => {
        this.setState({loading:false});
        console.log("graph data err>>", err);
      });

  };

  componentDidMount() {
    this.getGraphData();
  }

  render() {
    const options = {
      theme: "light2",
      animationEnabled: true,
      toolTip: {
        shared: true,
      },
      legend: {
        cursor: "pointer",
        itemclick: this.toggleDataSeries,
      },
      data: [
        {
          type: "splineArea",
          name: this.state.message,
          lineColor: '#4F46E5',
          markerColor: "#4F46E5",
          lineThickness: 4,
          color: "#EEF2FF",
          showInLegend: true,
          dataPoints:this.state.dataPoints.slice(0,this.state.count),
        },
      ],
    };
console.log('countcount',this.state.count)
    return (
      <div className="moduleBorder">
        <div className="d-flex row space-between m-1_5rem">
          <div>
            <span className="bold1Rem commonBlackcolor">Expense Report</span>
          </div>
          <div className="overflow-x">
            {filter.map((item, id) => (
              <span 
              className={`graphFilter ${this.state.count === item.count ? 'selected' : ''}`}
              key={id} onClick={()=> this.setState({count:item.count})}>
                {item.day}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-x">
          <CanvasJSChart options={options} onRef={(ref) => (this.chart = ref)} containerProps={{ width: '95%' }} />
        </div>
      </div>
    );
  }
}

export default DashBoardGraph;
