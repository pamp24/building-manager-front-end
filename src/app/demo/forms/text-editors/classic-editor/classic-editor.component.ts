// Angular import
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import jsonDoc from './editor';
import { Validators, Editor, Toolbar, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-classic-editor',
  imports: [CommonModule, SharedModule, NgxEditorModule],
  templateUrl: './classic-editor.component.html',
  styleUrls: ['./classic-editor.component.scss']
})
export class ClassicEditorComponent implements OnInit, OnDestroy {
  // public props
  editorDoc = jsonDoc;

  editor!: Editor;

  // life cycle event
  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  // public method
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify']
  ];

  form = new FormGroup({
    editorContent: new FormControl({ value: jsonDoc, disabled: false }, Validators.required())
  });
}
