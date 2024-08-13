import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DepartmentService } from '../../../services/department.service';
import { departmentData, departments, department } from '../../../models/department';
import { Employee, EmployeeById, EmployeeForm, Employees } from '../../../models/emloyee';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { last } from 'rxjs';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent implements OnInit {

  public departments: departmentData[] = [];
  public departmentEmployees: Employee[] = [];
  private departmentId: number | null = null;
  public paramId = '';
  public isEdit = false;

  public EmployeeForm = new FormGroup<EmployeeForm>({
    username: new FormControl(''),
    password: new FormControl(''),
    name: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl(),
    salary: new FormControl(),
    departmentId: new FormControl(),
    managerId: new FormControl(),
    role: new FormControl()
  });

  constructor(private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getParamId();
    this.getDepartments();
  }

  private getParamId(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.paramId = (paramMap.get('id')) ?? '';
      if (this.paramId) {
        this.isEdit = true;
        this.getEmployeeData();
      }

    });
  }

  private getEmployeeData(): void {
    this.employeeService.getEmployeeById(Number(this.paramId)).subscribe((response: EmployeeById) => {
      const employee = response.data;

      // getting all the employees by department
      if (employee.departmentId) {
        this.employeeService.getEmployeesByDepartmentName(employee.departmentId).subscribe((response: Employees) => {
          this.departmentEmployees = response.data;

          // setting the value of the form
          this.EmployeeForm.patchValue({
            username: null,
            password: null,
            name: employee.name ?? '',
            salary: employee.salary ?? 0,
            email: employee.email ?? '',
            phone: employee.phone ?? '',
            address: employee.address ?? '',
            departmentId: employee.departmentId ?? null,
            managerId: employee.id ?? null,
            role: employee.role ?? ''
          });
        });
      } else {
        // setting the form values even if departmentId is not present
        this.EmployeeForm.patchValue({
          username: null,
          password: null,
          name: employee.name ?? '',
          salary: employee.salary ?? 0,
          email: employee.email ?? '',
          phone: employee.phone ?? '',
          address: employee.address ?? '',
          departmentId: null,
          managerId: null,
          role: employee.role ?? ''
        });
      }
    });
  }

  private getDepartments(): void {
    this.departmentService.getDepartment().subscribe((response: departments) => {
      this.departments = response.data;
    });
  }

  public onDepartmentChange(event: any): void {
    this.departmentId = event.target.value;
    if (this.departmentId) {
      this.getEmployeeByDepartment(this.departmentId);
    }
  }

  private getEmployeeByDepartment(id: number): void {
    // calling the employee service to get the employees by department
    this.employeeService.getEmployeesByDepartmentName(id).subscribe((response: Employees) => {
      this.departmentEmployees = response.data;
    });
  }

  public addEmployee(): void {
    console.log(this.EmployeeForm.value)
    if (this.EmployeeForm.value.name && this.EmployeeForm.value.salary && this.EmployeeForm.value.username
      && this.EmployeeForm.value.password && this.EmployeeForm.value.email && this.EmployeeForm.value.address
      && this.EmployeeForm.value.phone
    ) {

      const body = {
        username: this.EmployeeForm.value.username,
        password: this.EmployeeForm.value.password,
        name: this.EmployeeForm.value.name,
        salary: this.EmployeeForm.value.salary,
        email: this.EmployeeForm.value.email,
        phone: this.EmployeeForm.value.phone,
        address: this.EmployeeForm.value.address,
        departmentId: this.EmployeeForm.value.departmentId,
        managerId: this.EmployeeForm.value.managerId,
        role: Number(this.EmployeeForm.value.role)
      };

      this.employeeService.addEmployee(body).subscribe(response => {
        alert('Employee added successfully');
        this.EmployeeForm.reset();
      });
    }
  }

  public updateEmployee(): void {
    if (this.EmployeeForm.value.name && this.EmployeeForm.value.salary && this.paramId,
      this.EmployeeForm.value.email && this.EmployeeForm.value.address && this.EmployeeForm.value.phone
    ) {

      const body = {
        name: this.EmployeeForm.value.name,
        salary: this.EmployeeForm.value.salary,
        email: this.EmployeeForm.value.email,
        address: this.EmployeeForm.value.address,
        phone: this.EmployeeForm.value.phone,
        departmentId: Number(this.EmployeeForm.value.departmentId),
        managerId: Number(this.EmployeeForm.value.managerId),
        role: Number(this.EmployeeForm.value.role)
      };

      this.employeeService.updateEmployee(body, Number(this.paramId)).subscribe(response => {
        alert('Employee updated successfully');
        this.router.navigate(['/employee']);
      });
    }
  }

}