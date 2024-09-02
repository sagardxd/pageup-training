import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../../services/department.service';
import { departmentData, departments } from '../../../models/department';
import {
  Employee,
  EmployeeById,
  EmployeeForm,
  Employees,
} from '../../../models/emloyee';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RequestHandlerService } from '../../../services/request-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
})
export class EmployeeEditComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public departments: departmentData[] = [];
  public departmentEmployees: Employee[] = [];
  private departmentId: number | null = null;
  public paramId = '';
  public isEdit = false;

  public EmployeeForm = new FormGroup<EmployeeForm>({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\d{10}$/),
    ]),
    salary: new FormControl(null, [Validators.required, Validators.min(0)]),
    departmentID: new FormControl(null, [Validators.required]),
    managerID: new FormControl(),
    role: new FormControl(null, [Validators.required]),
  });

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private requestHandler: RequestHandlerService
  ) {}
  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((x) => {
        x.unsubscribe();
      });
    }
  }

  ngOnInit(): void {
    this.getParamId();
    this.getDepartments();
  }

  private getParamId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this.paramId = paramMap.get('id') ?? '';
        if (this.paramId) {
          this.isEdit = true;
          this.getEmployeeData();
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error fetching ParamId',
        });
      },
    });
  }

  private getEmployeeData(): void {
    this.subscriptions.push(
      this.employeeService
        .getEmployeeByIdUpdate(Number(this.paramId))
        .subscribe((response: EmployeeById) => {
          const employee = response.data;
          console.log(response);

          // getting all the employees by department
          if (employee.departmentID) {
            this.employeeService
              .getEmployeesByDepartmentName(employee.departmentID)
              .subscribe((response: Employees) => {
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
                  departmentID: employee.departmentID ?? null,
                  managerID: employee.managerID ?? null,
                  role: employee.role ?? '',
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
              departmentID: null,
              managerID: null,
              role: employee.role ?? '',
            });
          }
        })
    );
  }

  private getDepartments(): void {
    this.departmentService.getDepartment().subscribe({
      next: (response: departments) => {
        this.departments = response.data;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get Deparments',
        });
      },
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
    this.employeeService.getEmployeesByDepartmentName(id).subscribe({
      next: (response: Employees) => {
        this.departmentEmployees = response.data;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get Deparments By Employee',
        });
      },
    });
  }

  public addEmployee(): void {
    if (this.EmployeeForm.valid) {
      const body = {
        //TODO
        username: this.EmployeeForm.controls.username.value!,
        password: this.EmployeeForm.value.password!,
        name: this.EmployeeForm.value.name!,
        salary: this.EmployeeForm.value.salary!,
        email: this.EmployeeForm.value.email!,
        phone: this.EmployeeForm.value.phone!,
        address: this.EmployeeForm.value.address!,
        departmentID: Number(this.EmployeeForm.value.departmentID) || null,
        managerID: Number(this.EmployeeForm.value.managerID) || null,
        role: Number(this.EmployeeForm.value.role) || null,
      };

      this.employeeService.addEmployee(body).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Added Employee Successfully',
            });
          }
        },
        error: (error) => {
          console.error('Error:', error);
        },
        complete: () => {
          this.requestHandler.stopRequest();
          this.EmployeeForm.reset();
        },
      });
    }
  }

  public updateEmployee(): void {
    if (
      this.EmployeeForm.value.name &&
      this.EmployeeForm.value.salary &&
      this.paramId &&
      this.EmployeeForm.value.email &&
      this.EmployeeForm.value.address &&
      this.EmployeeForm.value.phone
    ) {
      const body = {
        name: this.EmployeeForm.value.name || null,
        salary: this.EmployeeForm.value.salary || null,
        email: this.EmployeeForm.value.email || null,
        address: this.EmployeeForm.value.address || null,
        phone: this.EmployeeForm.value.phone || null,
        departmentID: Number(this.EmployeeForm.value.departmentID) || null,
        managerID: Number(this.EmployeeForm.value.managerID) || null,
        role: Number(this.EmployeeForm.value.role) || null,
      };

      this.employeeService
        .updateEmployee(body, Number(this.paramId))
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Updated',
              detail: 'Updated Employee Successfully',
            });
            this.router.navigate(['/employee']);
          },
          error: (error) => {
            console.error('Error:', error);
          },
          complete: () => {
            this.EmployeeForm.reset();
          },
        });
    }
  }
}
