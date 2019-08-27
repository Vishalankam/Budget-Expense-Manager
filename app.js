
////////////BUDGET controller


var budgetController = (function(){
    
    //income function constructor 
    var Income = function(id, description, value )
    {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    // EXPENCE function constructor
      var Expence  = function(id, description, value )
    {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage= -1;
    }
      Expence.prototype.calpercentage = function(totalIncome)
      {
          if (totalIncome >0)
            {  
                this.percentage =Math.round((this.value/totalIncome)*100);
                
            }
          else {
              this.percentage =-1;
          }
                                      
       };
    Expence.prototype.getPercent = function()
    {
        return this.percentage;
    }
    
     var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
        // console.log(sum + 'sum');
    };
    
    
     
      // DATA object
      var data = {
           allItems :{
               exp : [],
               inc : []
           },
          totals:{
              exp :0,
              inc :0
          },
          budget: 0,
          percentage:-1
      };

 return{
     addItem : function(type, desc, value )
     {
        var newItem, ID;
         
        //creating a unique ID
        ///unique ID = last ID +1;
        
         if (data.allItems[type].length>0)
       { ID = data.allItems[type][data.allItems[type].length-1].id+1;
       }
          else
            ID=0;
        // CREATING A NEW ITEM 
        if (type === 'exp')
            {
                newItem = new Expence(ID, desc, value);
             ///newItem.calpercentage();  ///calculating the percentage for each expense
               //console.log(newItem.percentage);
            }
        else if (type ==='inc')
        {
            newItem = new Income(ID, desc, value);
        }
        
        data.allItems[type].push(newItem);
     //  data.totals[type] += parseFloat(newItem.value);
     //// console.log(data.totals[type]+ 'added successfully'+ newItem.id);
       
        return newItem;
    },
    
     getBudget: function()
     {
       
         /*var totalExp = data.totals.exp;
         var totalInc = data.totals.inc;
        var totalAmount = (totalInc - totalExp);
         var percent = (totalExp/totalInc)*100; */
            return {
                budget:data.budget,
                totalExp: data.totals.exp,
                totalInc: data.totals.inc,
                percent:data.percentage
         };
     },
       deleteItem : function (id , type)
        {
            var ids, index, values;
            
            ids = data.allItems[type].map(function(current){ 
                return current.id ;/// we would get the arrays of IDs after this map 
 })
            /*values = data.allItems[type].map(function(current){
                return current.value;
            })         */                      /////this would return  the array of values 
           index = ids.indexOf(id);
           
               //data.totals[type] =parseFloat(data.totals[type]-values.valueOf(index)); // featch the value of the entry we are deleting
    
            console.log(index +' -index');
    
        if (index !== -1) // returns -1 if element not found 
            {
                data.allItems[type].splice(index, 1) ;
                
            }
            
        },
      calculateBudget: function() {
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }            
            
            // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
        },
     calculatePercentage :function()
     {
         data.allItems.exp.forEach(function(cur)
         {
             cur.calpercentage(data.totals.inc);    
            
        })
     },
     getPercentage : function(){
        var allPercentage = data.allItems.exp.map(function(cur){
            return cur.getPercent();
        });
         return allPercentage;
     }

};
  
})();
   
////////////////////////////////////////////////////////////////UI CONTROLLER

var  UIController = (function(){

    var  DOMStrings= {
        inputType: '.add__type',
        inputDescription : '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer: '.expenses__list',
        budgetValue : '.budget__value',
         budgetInc : '.budget__income--value',
        budgetExp :'.budget__expenses--value',
        budgetpercent: '.budget__expenses--percentage',
        container: '.container',
        expPercentage: '.item__percentage',
        month : '.budget__title--month'
    };
    
    var formatNumber = function (num )
        {
            var numSplit , int, dec;
            
         // num=Math.abs(num);
            num =num.toFixed(2);
            
             numSplit = num.split('.');
            
            int = numSplit[0];
            if (int.length>3)
            int = int.substring(0,int.length-3) +','+int.substr(int.length-3 ,3)
            
            dec = numSplit[1];
            
            return int +'.'+ dec;
            
        };
     var nodeListForEach = function(list , callback)
            {
                for (var i=0;i<list.length ;i++)
                    {
                        callback(list[i],i);
                    }
            };
    
    return{
        
        getInput: function(){
            
            return {
           type : document.querySelector(DOMStrings.inputType).value,
           discription : document.querySelector(DOMStrings.inputDescription).value,
           value :  parseFloat(document.querySelector(DOMStrings.inputValue).value)
            
            };
        },
        getDOMStrings: function()
        {
        return DOMStrings;
        },
        addListItem : function (obj , type)
        {
            var html , newHtml, element;
            // create an HTML string with the place holder text 
            if (type==='inc'){
                element =DOMStrings.incomeContainer;
            html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'         
            }
            else if ( type === 'exp')
                {
                    element = DOMStrings.expenseContainer;
                    html ='<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%percentage%%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div>  </div>'
                }
            /// replace plceholder text with some actual data 
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value));
        
            // getting the percentage for perticular expense
                 
            
            
            ////INSERT THE HTML TO DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);  ////new function 
        },
        deleteListItem: function(selectedId)   ///we can not delete the node directly but we can delete the child node 
        {
            var el = document.getElementById(selectedId);
            el.parentNode.removeChild(el);
        },
        clearFields : function()
        {
            document.querySelector(DOMStrings.inputDescription).value = "";
            document.querySelector(DOMStrings.inputValue).value  ="";
            console.log('cleared Fields');
            /*var field, fieldsArr;
           feild=  document.querySelectorAll(DOMStrings.inputDescription +','+ DOMStrings.inputValue);
           feildsArr = Array.prototype.slice.call(feild);
            feildsArr.forEach(function (current, index , Array)
            {
              current ="";  
                
            });*/
        },
        displayBudget : function (budget){
            
            document.querySelector(DOMStrings.budgetValue).textContent =formatNumber(budget.budget);
             document.querySelector(DOMStrings.budgetExp).textContent ='-'+formatNumber(budget.totalExp);
             document.querySelector(DOMStrings.budgetInc).textContent ='+'+formatNumber(budget.totalInc);
            if (budget.percent >0)
            document.querySelector(DOMStrings.budgetpercent).textContent =Math.floor(budget.percent) + '%';
            else 
               document.querySelector(DOMStrings.budgetpercent).textContent = '--' +'%';
                
        },
        displayMonth : function ()
        {
          var now , year, month  ;
            
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May','June','July','August','September','October', 'November', 'December'];
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMStrings.month).textContent = months[month] +' '+ year;
            
        },
        changeType : function ()
        {
          var fields =  document.querySelectorAll(DOMStrings.inputType +','+ DOMStrings.inputDescription +','+ DOMStrings.inputValue);
            
            nodeListForEach(fields , function(cur){
                cur.classList.toggle('red-focus');
            })
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red')
            
        },
        
        displayPercentage : function(percentages){
            
            var fields = document.querySelectorAll(DOMStrings.expPercentage);
            
           
            nodeListForEach(fields , function(current , index){
                
                if (percentages[index]>0)
                    {
                        current.textContent = percentages[index]+'%';
                    }
                else 
                    {
                        current.textContent = '--%';
                    }
            })
            
            
        }
      
    };

})();

////////////////////////////////////////////////////////////////////// CONTROLLER


var controller = (function(budgetCtrl, UICtrl){

    
    var setUpInitialization = function(){
        var DOMStrings = UICtrl.getDOMStrings();
         
    document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem)
    
    document.addEventListener('keypress', function(event){

        if (event.keyCode == 13 || event.which ==13) 
            {
                ctrlAddItem();
            }
    })
       document.querySelector(DOMStrings.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOMStrings.inputType).addEventListener('change', UICtrl.changeType);
        UICtrl.displayMonth();
    }
 
    var updateBudget =function()
    {
        //1.CALCULATE THE BUDGET    
          budgetCtrl.calculateBudget();
        
        var budget = budgetCtrl.getBudget();
      
        console.log (budget +'total ');
        
        //3.return the budget 
        
        
        //2.update the budget on ui 
          UICtrl.displayBudget(budget);
        
    }
    var updatePercentage= function()
    {
        // calculate the percentage 
         budgetCtrl.calculatePercentage();
        
        // get percentage 
        var allPercentages = budgetCtrl.getPercentage();
        
        // display on ui
        console.log(allPercentages);
        
        UICtrl.displayPercentage(allPercentages);
        
        
    }
    
    var ctrlAddItem = function()
    {
        ///1. GET THE FEILD INPUT DATA 
    var input = UICtrl.getInput();
        
        ///2. ADD NEW ITEM 
        if (input.discription !== '' && input.value !== 'NaN'){
         var newItem =   budgetCtrl.addItem(input.type, input.discription, input.value);
        console.log(newItem);
        
        //3. ADD THE DATA TO UI
        UICtrl.addListItem(newItem, input.type);
        
        //4. CLEAR THE FIELDS
        UICtrl.clearFields();
        
        //5.update budget
        updateBudget();
            ///6. udpadte percentage 
        updatePercentage();
        }
    }
    var ctrlDeleteItem = function(event)
    {
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id ;
        
        if (itemID){
        var splitId = itemID.split('-');
        var type = splitId[0];
        var id =parseInt(splitId[1]);
        if (type == 'income')
            type = 'inc';
        else if (type==='expense')
            type ='exp';
        
        console.log('id '+id+ ' type '+type);
        
        //delete that entry from data 
        
        budgetCtrl.deleteItem(id, type);
        
        //delete from  the UI
        
            UICtrl.deleteListItem(itemID);
        
        
        //update UI
            updateBudget();
        }
        
    };  
    
   
    return {
        init : function()
        {
            console.log('app has been started');
               
            var initBudget ={
             totalExp : 0,
              totalInc: 0,
                budget:0,
                percent: 0
            }
              UICtrl.displayBudget(initBudget);
            setUpInitialization();
            
        }
    }
    
})(budgetController, UIController);


///START THE APP 
controller.init();

















