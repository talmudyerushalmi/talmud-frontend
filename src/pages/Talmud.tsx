import React from 'react';
import { connect } from 'react-redux';


const mapStateToProps = (state:any) => {
    console.log('state is ', state)
   // console.log('state is ', state.getState())
    return state;
//     return ({
//     currentMishna: state.general.currentMishna,
//     filteredExcerpts: state.mishnaView.filteredExcerpts,
//     selectedExcerpt: state.mishnaView.selectedExcerpt,
//     detailsExcerptPopup: state.mishnaView.detailsExcerptPopup,
//     expanded: state.mishnaView.expanded,
//     loading: state.general.loading,
//   })
}
 export const Talmud = (props:any)=>{
     console.log('props are ', props)
  return (
    <div>
        Talmud page
     
    </div>
  );
}

export default connect(mapStateToProps)(Talmud);
