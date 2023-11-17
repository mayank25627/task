import React, { Component } from 'react'

export default class PrizesList extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         prizesList : [],
         filterList: [],
         categoryList: [],
         selectedCategory:"",
         listOfYears: [],
         selectedYears:'',
         filterByFiled:[]
      }
    }

    async componentDidMount() {
        const response = await fetch('https://api.nobelprize.org/v1/prize.json',{ 
      headers: {
        'Content-Type': 'application/json'
      }});
      const data = await response.json();
      let prizesList = [];
      console.log(data.prizes);
      data.prizes?.map((_data) => {return(_data.laureates?.map((_laureate)=>{
        return prizesList.push({id: _laureate.id,
             name: _laureate.firstname + ' ' + _laureate.surname , 
             category : _data.category,
            year : _data.year})
    }))})
    this.setState({prizesList});
// people who have won the Nobel prize more than 1 time
    const nameCount = {};
    prizesList.forEach(item => {
      const name = item.name;
      nameCount[name] = (nameCount[name] || 0) + 1;
    });         
    const filteredData = prizesList.filter(item => nameCount[item.name] > 1 );
    const uniqueNames = new Set();
const result = filteredData.filter(item => {
  if (!uniqueNames.has(item.name)) {
    uniqueNames.add(item.name);
    return true;
  }
  return false;
});

    this.setState({filterList: result});
    // list of categories
    const uniqueCategories = new Set(data.prizes.map(item => item.category));

// Convert Set back to an array
this.setState({categoryList :Array.from(uniqueCategories)})
const startYear = 1900;
  const endYear = 2018;

  const yearsArray = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
  this.setState({listOfYears:yearsArray});
    }

    filterByFieldFunc = () => {
        let filterArray = this.state.prizesList.filter(_prizes =>{
            const matchCategory = this.state.selectedCategory === "" || this.state.selectedCategory === _prizes.category;
        const matchYear = this.state.selectedYears === "" || this.state.selectedYears === _prizes.year;
    
        return matchCategory && matchYear;       
        })
        this.setState({filterByFiled : filterArray});
    }

    
  render() {
    return (
      <div>
        <h1>
            List of people who have won the Nobel prize more than 1 time
       </h1>
        {this.state.filterList.map(_data=> {return(
            <div><b>{_data.name}</b></div>
        )})}
        <hr />
       <h1>
            List of Prizes
       </h1>
        <div>
           <label>choose categorie</label>
           <select value={this.state.selectedCategory} onChange={event => this.setState({selectedCategory:event.target.value},()=>this.filterByFieldFunc())}>
            <option value="">select categorie</option>
           {this.state.categoryList.map(_category =>{return(<option value={_category}>
            {_category}
           </option>)})}
           </select>
        </div>
        <div>
           <label>Choose Year</label>
           <select value={this.state.selectedYears} onChange={event => this.setState({selectedYears:event.target.value},()=>          
           this.filterByFieldFunc())}>
            <option value="">select year</option>
           {this.state.listOfYears.map(_years =>{return(<option value={_years}>
            {_years}
           </option>)})}
           </select>
        </div>
        <div>{
            (this.state.selectedYears || this.state.selectedCategory) ? 
        this.state.filterByFiled.map((_data)=>{ return(
            <div key={_data.id} style={{display:"flex" , justifyContent:"space-around"}}>
                <div> {_data?.name} </div>
                <div> {_data?.year} </div>
                <div> {_data?.category} </div>
            </div>
        )
        }) : this.state.prizesList.map((_data)=>{ return(
            <div key={_data.id} style={{display:"flex" , justifyContent:"space-around"}}>
                <div> {_data?.name} </div>
                <div> {_data?.year} </div>
                <div> {_data?.category} </div>
            </div>
        )
        })
  } </div>
      </div>
    )
  }
}
