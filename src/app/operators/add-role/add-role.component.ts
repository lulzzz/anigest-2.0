import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OperatorService } from '../operator.service';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {

  actions = [{ id: 1, name: "Novo" }, { id: 2, name: "Pesquisar" },  { id: 3, name: "Editar" },  { id: 4, name: "Eliminar" }, ]
  availableResources : any = [
    {resourceId: 1, resourceName: 'Students'},
    {resourceId: 2, resourceName: 'Schools'}
    ];

  myForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private os: OperatorService, private fb: FormBuilder) { }

  ngOnInit() {

    this.myForm = this.fb.group({
      role: [],
      description: [],
      functionalities: this.fb.array([])
    });
  }

  get functionalitiesForm(){
    return this.myForm.get('functionalities') as FormArray
  }
  

  addFunctionalities() {

    const group = this.fb.group({ 
      T_resource_idT_resource:[],
      T_permission_idT_permission: this.fb.array([])
    })
  
    this.functionalitiesForm.push(group);
  }  

  onChange(id: string, isChecked: boolean, funcId: number) {
    
    
    //const actionFormArray = <FormArray>this.myForm.get('functionalities[i].T_permission_idT_permission');
    var myFunc = this.functionalitiesForm;
    myFunc.controls.forEach(eachFunctionality => {
      if(eachFunctionality.get('T_resource_idT_resource').value == funcId){
        if (isChecked) {
          eachFunctionality.value.T_permission_idT_permission.push(id);
          //actionFormArray.push(new FormControl(id));
        } else {
          //let index = actionFormArray.controls.findIndex(x => x.value == id)
          //actionFormArray.removeAt(index);
        }
      }
     
    })
  }

  registerRole(){
    const forms = this.myForm.value;
  //  this.os.registerRole(forms);
    console.log(forms)
  }

}

/* this.myForm = this.fb.group({
  role: [],
  description: [],
  list_functions: this.fb.array([this.fb.group({resource: '', permissions: this.fb.array([])})])
})
}

get listFunctions() {
return this.myForm.get('list_functions') as FormArray;
}

addFunctionalityOption(){

let newPerms = this.fb.array([{name:"Create", id:1, valor: new FormControl(false)},{name:"Edit", id:2, valor: new FormControl(false) },{name:"Delete", id:3, valor: new FormControl(false) }])

this.listFunctions.push(this.fb.group({resource: '', permissions: newPerms}))
}


delFunctionalityOption(index){
this.listFunctions.removeAt(index);
} */