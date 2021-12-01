import { useEffect, useState } from 'react';
import './App.css';
import products from './database/products.json'

function App() {
  const [data, setdata] = useState(products);
  const [NoOfComparision, setNoOfComparision] = useState(0.00);
  const [searchTypeisLinear, setsearchTypeisLinear] = useState(true);
  const [searchText, setsearchText] = useState();
  const [isSearched, setisSearched] = useState(false);
  
  
  // Sorting Section
  const SortOptions = (e) => {
    if (e === "0")
      setdata(products);
    else if (e === "1")
      Sorting(products, "price", "ascending");
    else if (e === "2")
      Sorting(products, "price", "descending");
    else if (e === "3")
      Sorting(products, "name", "ascending");
    else if (e === "4")
      Sorting(products, "name", "descending");
  }
  
  const Sorting = (arr, sortUsing, sortBy) => {
    setisSearched(false);                           // hide search result text
    setsearchText('');                              // clear text from from search box      
    let array = arr.slice();                        // Copy array from index 0 to last index
    if (sortBy === "ascending") {
      for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
          const currentIndexPrice = sortUsing == "price" ? Number(array[j][sortUsing]) : array[j][sortUsing];
          const maxIndexPrice = sortUsing == "price" ? Number(array[minIndex][sortUsing]) : array[minIndex][sortUsing];
          if (currentIndexPrice < maxIndexPrice) {
            minIndex = j;
          }
        }

        //Swapping minimum value to the current index
        const temp = array[i];
        array[i] = array[minIndex];
        array[minIndex] = temp;
        // [array[i], array[minIndex]] = [array[minIndex], array[i]];
      }
    } 
    //Descending Order
    else {
      for (let i = 0; i < array.length; i++) {
        let maxIndex = i;
        for (let j = i + 1; j < array.length; j++) {
          const currentIndexPrice = sortUsing == "price" ? Number(array[j][sortUsing]) : array[j][sortUsing];
          const maxIndexPrice = sortUsing == "price" ? Number(array[maxIndex][sortUsing]) : array[maxIndex][sortUsing];
          if (currentIndexPrice > maxIndexPrice) {
            maxIndex = j;
          }
        }

        //Swapping maximum value to the current index
        const temp = array[i];
        array[i] = array[maxIndex];
        array[maxIndex] = temp;
        // [array[i], array[maxIndex]] = [array[maxIndex], array[i]];
      }
    }
    setdata(array);
  }
  // Sorting Section End


  // Search Section
  const onSearch = (text) => {
    // setNoOfComparision(0);
    //if search field is empty
    if (text === null || text === '') {
      setdata(products);
    } else {
      // const startTime = +new Date();
      const searchedIndex = searchTypeisLinear ? LinearSearch(products, text) : BinarySearch(products, text);

      //If product not found
      if (searchedIndex === -1) {
        setisSearched(true);
        setdata([]);
      }
      //product found
      else {
        setisSearched(true);
        setdata([products[searchedIndex]]);
      }

      // const endTime = +new Date();
      // timer((endTime - startTime).toFixed(2))
    }
  }

  const BinarySearch = (products, text) => {
    let count = 0;
    let start = 0, end = products.length - 1, mid = 0;
    while (start <= end) {
      count++;
      mid = Math.floor(start + (end - start) / 2);
      if (Number(text) === products[mid].id) {
        timer(count);
        return mid;
      }
      else if (Number(text) < products[mid].id) {
        start = mid + 1;
      }
      else {
        end = mid - 1;
      }
    }
    timer(count);
    return -1;
  }

  const LinearSearch = (products, text) => {
    let count = 0;
    for (let i = 0; i < products.length; i++)
    {
      count ++;
      if (products[i].id === Number(text))
      {
        timer(count);
        return i;
      }
    }
    timer(count);
    return -1;
    
  }
  
  // Search Section End

  const timer = (endTime) => {
    setNoOfComparision(0);
    let timeout = 10;
    for(let i = 0; i <= Number(endTime); i++)
    {
      setTimeout(() => {
        setNoOfComparision(i);
      }, timeout);
      timeout += 10;
    }
  }

  const cancelAllSearches = () => {
    setdata(products);
    setisSearched(false);
    setsearchText('')
  }

  return (
    <div className="main">
      <div className="container">
        <h1>Our Products</h1>
        <div className="d-flex justify-content-between">
          <div style={{flexBasis: 0}}>
            <label htmlFor="products">SORT BY:</label>
            <select onChange={e => SortOptions(e.target.value)} className="Sorting-Dropdown" name="products" id="products">
              <option value="0">Best Match</option>
              <option value="1">Low to High</option>
              <option value="2">High to Low</option>
              <option value="3">A to Z</option>
              <option value="4">Z to A</option>
            </select>
          </div>


          <div className="speedMeter">
            <p>{NoOfComparision}</p>
            <p>no of comparisions</p>
          </div>

          <div className="d-flex flex-column align-items-end mb-3">
            <div className="searchContainer">
              <input className="searchInput" value={searchText} onChange={e => setsearchText(e.target.value)} type="text" placeholder="Search product ID" />
              <button onClick={() => onSearch(searchText)} className="searchIconContainer">
                <i className="fa fa-search text-white" aria-hidden="true"></i>
              </button>
            </div>
            <div>
              <div className="typesOfSearchContainer" >
                <h4 className="searchHead">Types of Search</h4>
                <div className="d-flex">
                  <div onClick={() => setsearchTypeisLinear(true)} className="searchType" style={searchTypeisLinear ? {backgroundColor: 'green', color: '#fff'} : {backgroundColor: '#fff', color: '#000'}}>
                    <p>Linear</p>
                  </div>
                  <div onClick={() => setsearchTypeisLinear(false)} className="searchType" style={searchTypeisLinear ? {backgroundColor: '#fff', color: '#000'} : {backgroundColor: 'green', color: '#fff'}}>
                    <p>Binary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isSearched && (
          <div className="d-flex flex-row align-items-center text-red">
            <p>Search Result '{searchText}'</p>
            <button onClick={() => cancelAllSearches()} className="closeIcon">
              <i className="fa fa-close" aria-hidden="true"></i>
            </button>
          </div>
        )}

        <div className="row">
          {data.length ? (
            data.map((item, index) =>
              <div key={index} className="col-3 col-sm-6 col-md-4">
                <div className="productItem">
                  <img
                    className="ProductImg"
                    src={item.image_link}
                    onError={(e)=>{e.target.onerror = null; e.target.src=require('./images/notavailable.png').default}}
                    alt="product"
                  />

                  <div className="content">
                    <h3>{item.name + item.id}</h3>
                    <p className="product-description">
                      {item.description}
                    </p>
                    <div className="Categoryrow">
                      <p>Category: </p>
                      <p>{" " + item.category}</p>
                    </div>

                    <div className="Categoryrow">
                      <p>$ {item.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            )) :
            <div className="text-center">
              <img src={require('./images/proUnavailable.png').default} />
              <h2>Couldn't find the product</h2>
              <p>Sorry we couldn't find anything. You can try another search.</p>
            </div>
          }

        </div>
      </div>
    </div>
  );
}

export default App;