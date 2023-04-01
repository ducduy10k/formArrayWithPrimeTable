import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable, timer } from 'rxjs';

interface Product {
  id: string | number;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

interface SelectItem {
  label: string;
  value: string;
}

class CustomFormGroup extends FormGroup {
  private readonly _id: string | number;
  constructor(
    controls: {
      [key: string]: AbstractControl;
    },
    id: string | number
  ) {
    super(controls);
    this._id = id;
  }

  get id(): string | number {
    return this._id;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('tbl', { static: true })
  tbl!: Table;
  title = 'formArrayWithPrimeTable';
  statuses: SelectItem[] = [];
  clonedProducts: any = {};

  formData: FormGroup;
  constructor(private messageService: MessageService) {
    this.formData = new FormGroup({
      products: new FormArray([]),
    });
  }
  ngOnInit() {
    new Observable<Product[]>((obs) => {
      timer(2000).subscribe(() => {
        obs.next([
          {
            id: 1,
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5,
          },
          {
            id: 2,
            code: 'f230fh0g3',
            name: 'B Phone',
            description: 'BKAV',
            image: 'BPhone.jpg',
            price: 65,
            category: 'Smartphone',
            quantity: 30,
            inventoryStatus: 'INSTOCK',
            rating: 5,
          },
        ]);
      });
    }).subscribe((data: Product[]) => {
      for (var item of data) this.addProduct(item);
    });
    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' },
    ];
    console.log(this.formData);
  }

  onRowEditInit(control: CustomFormGroup) {
    this.clonedProducts[control.get('id')?.value as any] = {
      ...control.value,
    };
  }

  onRowEditSave(control: CustomFormGroup) {
    if (control.value.price > 0) {
      delete this.clonedProducts[control.value.id];
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product is updated',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid Price',
      });
    }
  }

  onRowEditCancel(control: FormControl, index: number) {
    (this.formData.controls['products'] as FormArray)
      .at(index)
      ?.patchValue(this.clonedProducts[control.value.id]);
    delete this.clonedProducts[control.value.id];
  }

  addProduct(item?: Product, isEdit: boolean = false) {
    const id = item?.id || Math.floor(Math.random() * 1000000);
    if (isEdit) this.tbl.editingRowKeys[id as string] = true;
    (this.formData.controls['products'] as FormArray).push(
      new CustomFormGroup(
        {
          id: new FormControl(id),
          code: new FormControl(item?.code),
          name: new FormControl(item?.name),
          description: new FormControl(item?.description),
          image: new FormControl(item?.image),
          price: new FormControl(item?.price),
          category: new FormControl(item?.category),
          quantity: new FormControl(item?.quantity),
          inventoryStatus: new FormControl(item?.inventoryStatus),
          rating: new FormControl(item?.rating),
        },
        id
      )
    );
  }

  handleSubmit() {
    console.log(this.formData.value);
  }
}
