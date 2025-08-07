import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule, copyArrayItem } from '@angular/cdk/drag-drop';

// Zorro 組件
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzFlexModule } from 'ng-zorro-antd/flex';


export enum ComponentType {
  INPUT = 'input',
  SELECT = 'select',
  GROUP = 'group',
  DATEPICKER = 'datepicker',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  GRID = 'grid'
}

/** 表單組件 */
export interface FormComponent {
  id: string;
  type: ComponentType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  value?: any;
  // Grid 專用屬性
  nzSpan?: number;
  children?: FormComponent[];
}

/** 組件模板 */
export interface ComponentTemplate {
  type: ComponentType;
  label: string;
  icon: string;
}

/** 節點類型 */
export enum NodeType {
  COMPONENT = 'component',
  GROUP = 'group'
}

export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  children?: TreeNode[];
}


@Component({
  selector: 'app-form-designer',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    NzLayoutModule,
    NzListModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzRadioModule,
    NzSwitchModule,
    NzDividerModule,
    NzGridModule,
    NzEmptyModule,
    NzInputNumberModule,
    NzModalModule,
    NzSplitterModule,
    NzTagModule,
    NzFlexModule,
  ],
  templateUrl: './form-designer.component.html',
  styleUrls: ['./form-designer.component.less']
})
export class FormDesignerComponent {
  // 可用的組件模板
  componentTemplates: ComponentTemplate[] = [
    { type: ComponentType.GRID, label: 'Grid 網格', icon: 'border' },
    { type: ComponentType.INPUT, label: '文字輸入框', icon: 'form' },
    { type: ComponentType.TEXTAREA, label: '多行文字', icon: 'file-text' },
    { type: ComponentType.NUMBER, label: '數字輸入', icon: 'calculator' },
    { type: ComponentType.SELECT, label: '下拉選單', icon: 'down' },
    { type: ComponentType.DATEPICKER, label: '日期選擇器', icon: 'calendar' },
    { type: ComponentType.CHECKBOX, label: '複選框', icon: 'check-square' },
    { type: ComponentType.RADIO, label: '單選按鈕', icon: 'dot-chart' }
  ];

  // 表單中的組件
  formComponents = signal<FormComponent[]>([]);

  // 當前選中的組件
  selectedComponent = signal<FormComponent | null>(null);

  // 預覽模式開關
  isPreviewMode = signal<boolean>(false);


  ComponentType = ComponentType;

  constructor(private message: NzMessageService) { }


  // 獲取連接的拖放列表
  getConnectedDropLists(): string[] {
    const dropLists = ['componentList'];

    // 為每個Grid組件添加其內部的拖拽區域ID
    this.formComponents().forEach(component => {
      if (component.type === 'grid') {
        dropLists.push(`grid-${component.id}`);
      }
    });

    return dropLists;
  }

  // 生成唯一ID
  private generateId(): string {
    return 'component_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // 拖拽處理
  drop(event: CdkDragDrop<any[]>) {
    console.log('Drop event:');
    if (event.previousContainer === event.container) {
      // 在同一容器內移動
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // 從組件庫拖拽到表單區域，這是複製操作
      const template = event.previousContainer.data[event.previousIndex];
      const newComponent: FormComponent = {
        id: this.generateId(),
        type: template.type,
        label: template.label,
        required: false,
        placeholder: template.type !== 'grid' ? `請輸入${template.label}` : undefined,
        options: template.type === 'select' || template.type === 'radio' ? ['選項1', '選項2', '選項3'] : undefined,
        nzSpan: template.type === 'grid' ? 12 : undefined,
        children: template.type === 'grid' ? [] : undefined
      };

      // 添加到表單組件列表，而不是移動
      const currentComponents = this.formComponents();
      currentComponents.splice(event.currentIndex, 0, newComponent);
      this.formComponents.set([...currentComponents]);
    }
  }

  // Grid 內部拖拽處理
  dropInGrid(event: CdkDragDrop<any[]>, gridComponent: FormComponent) {
    if (event.previousContainer === event.container) {
      // 在同一個 Grid 內移動
      moveItemInArray(gridComponent.children!, event.previousIndex, event.currentIndex);
    } else {
      // 從組件庫拖拽到 Grid 內，這是複製操作
      const template = event.previousContainer.data[event.previousIndex];
      const newComponent: FormComponent = {
        id: this.generateId(),
        type: template.type,
        label: template.label,
        required: false,
        placeholder: template.type !== 'grid' ? `請輸入${template.label}` : undefined,
        options: template.type === 'select' || template.type === 'radio' ? ['選項1', '選項2', '選項3'] : undefined,
        nzSpan: undefined,
        children: undefined
      };

      // 添加到 Grid 的 children 中
      if (!gridComponent.children) {
        gridComponent.children = [];
      }
      gridComponent.children.splice(event.currentIndex, 0, newComponent);

      // 更新整個表單組件列表以觸發變更檢測
      this.formComponents.set([...this.formComponents()]);
    }
  }

  // 選擇組件
  selectComponent(component: FormComponent) {
    this.selectedComponent.set(component);
  }

  // 刪除組件
  removeComponent(component: FormComponent) {
    const components = this.formComponents().filter(c => c.id !== component.id);
    this.formComponents.set(components);
    if (this.selectedComponent()?.id === component.id) {
      this.selectedComponent.set(null);
    }
  }

  // 從 Grid 內部刪除組件
  removeComponentFromGrid(component: FormComponent, gridComponent: FormComponent) {
    if (gridComponent.children) {
      gridComponent.children = gridComponent.children.filter(c => c.id !== component.id);
      // 更新整個表單組件列表以觸發變更檢測
      this.formComponents.set([...this.formComponents()]);

      if (this.selectedComponent()?.id === component.id) {
        this.selectedComponent.set(null);
      }
    }
  }

  // 更新組件屬性
  updateComponent(component: FormComponent, property: string, value: any) {
    const components = this.formComponents().map(c =>
      c.id === component.id ? { ...c, [property]: value } : c
    );
    this.formComponents.set(components);

    // 更新選中組件的引用
    if (this.selectedComponent()?.id === component.id) {
      this.selectedComponent.set({ ...component, [property]: value });
    }
  }

  // 添加選項（用於select和radio）
  addOption(component: FormComponent) {
    const newOptions = [...(component.options || []), `選項${(component.options?.length || 0) + 1}`];
    this.updateComponent(component, 'options', newOptions);
  }

  // 刪除選項
  removeOption(component: FormComponent, index: number) {
    const newOptions = component.options?.filter((_, i) => i !== index) || [];
    this.updateComponent(component, 'options', newOptions);
  }

  // 更新選項
  updateOption(component: FormComponent, index: number, value: string) {
    const newOptions = [...(component.options || [])];
    newOptions[index] = value;
    this.updateComponent(component, 'options', newOptions);
  }

  // 預覽表單JSON
  previewForm() {
    console.log('Form Configuration:', this.formComponents());
    this.message.success('表單配置已輸出到控制台');
    return JSON.stringify(this.formComponents(), null, 2);
  }

  // 切換預覽模式
  togglePreviewMode() {
    this.isPreviewMode.set(!this.isPreviewMode());
    if (this.isPreviewMode()) {
      this.selectedComponent.set(null);
      this.message.info('進入預覽模式，可以測試表單功能');
    } else {
      this.message.info('退出預覽模式，返回設計模式');
    }
  }

  // 清空所有組件
  clearAllComponents() {
    this.formComponents.set([]);
    this.selectedComponent.set(null);
    this.message.success('已清空所有組件');
  }

  // 預覽模式下的表單提交
  onPreviewSubmit(formData: any) {
    console.log('Preview Form Data:', formData);
    this.message.success('表單提交成功（預覽模式）');
  }

  // TrackBy 函數優化渲染性能
  trackByFn(index: number, item: FormComponent): string {
    return item.id;
  }





  NodeType = NodeType;

  treeData: TreeNode[] = [
    {
      id: '1',
      name: 'Item 1',
      type: NodeType.GROUP,
      children: [
        { id: '1.1', name: 'Child Item 1.1', type: NodeType.COMPONENT, children: [] },
        { id: '1.2', name: 'Child Item 1.2', type: NodeType.COMPONENT, children: [] }
      ]
    },
    {
      id: '2',
      name: 'Item 2',
      type: NodeType.GROUP,
      children: [
        { id: '2.1', name: 'Child Item 2.1', type: NodeType.COMPONENT, children: [] },
        { id: '2.2', name: 'Child Item 2.2', type: NodeType.COMPONENT, children: [] }
      ]
    }
  ];

  getConnectedDropListIds(): string[] {
    const ids: string[] = [];

    const traverse = (n: TreeNode[]) => {
      for (const item of n) {
        ids.push(this.getDropListId(item));
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      }
    };

    traverse(this.treeData);
    ids.push(this.getDropListId(null)); // 根層 drop list ID
    return ids;
  }



  getDropListId(node: TreeNode | FormNode | null): string {
    return node ? `drop-${node.id}` : 'drop-root';
  }

  dropTree(event: CdkDragDrop<TreeNode[]>, parentNode: TreeNode | null) {
    const containerData = event.container.data;
    const previousData = event.previousContainer.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(containerData, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(previousData, containerData, event.previousIndex, event.currentIndex);
    }

    // ✅ 你可以在這裡做 parent 的更新管理
    // console.log('Dropped into', targetParent?.name ?? 'ROOT');
  }











  // GPT 生成表單設計器




  formSchema: FormNode[] = [];

  selectedNode: FormNode | null = null;


  getConnectedFormDropListIds(): string[] {
    const ids: string[] = [];
    const traverse = (nodes: FormNode[]) => {
      for (const node of nodes) {
        ids.push(this.getDropListId(node));
        if (node.children?.length) {
          traverse(node.children);
        }
      }
    };
    traverse(this.formSchema);
    ids.push(this.getDropListId(null));
    return ids;
  }

  onDrop(event: CdkDragDrop<FormNode[]>, parent: FormNode | null): void {
    const fromToolbox = event.previousContainer.id === 'toolbox';

    if (fromToolbox) {
      const clone = structuredClone(event.item.data);
      clone.id = this.generateId();
      if (clone.type === 'group') {
        clone.children = [];
      }
      event.container.data.splice(event.currentIndex, 0, clone);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  selectNode(node: FormNode): void {
    this.selectedNode = node;
  }

}


interface FormNode {
  id: string;
  type: 'input' | 'select' | 'group';
  label?: string;
  key?: string;
  options?: string[];
  children?: FormNode[];
}























