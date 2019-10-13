import { Component, OnInit, TemplateRef } from '@angular/core';
import { SiccService } from './sicc.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-sicc',
  templateUrl: './sicc.component.html',
  styleUrls: ['./sicc.component.css'],
  providers: [SiccService]
})
export class SICCComponent implements OnInit {

  fileToUpload: File = null;
  newFile: Array<any>;
  siccInfo;
  files: TreeNode[];

  constructor(private service: SiccService, private modalService: NgbModal) { }

  ngOnInit() {
    /* this.service.getFiles().then(files => {this.files = files,
      console.log(this.files)}); */
    this.files = [
      {
        label: 'SICC',
        collapsedIcon: 'fas fa-folder',
        expandedIcon: 'fas fa-folder-open',
        children: [
          {
            label: 'Inbox',
            collapsedIcon: 'fas fa-inbox',
          },
          {
            label: 'Outbox',
            collapsedIcon: 'far fa-envelope',
            children: [
              {
                label: 'Past',
                icon: 'fas fa-file'
              }
            ]
          }

        ]
      }
    ]



  }

  openIMT() {
    window.open("http://parcerias.imtt.pt/login.php?username=119&password=07E1CD");
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploadDocument()
  }

  uploadFileToActivity(template) {
    this.service.postFile(this.fileToUpload).subscribe(data => {
      if (data) {
        this.siccInfo = Object.values(data),
          this.openModal(template)
      }
      console.log(Object.values(data))
    }, error => {
      console.log(error);
    });


  }

  uploadDocument() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {

      console.log(fileReader.result);
      let hey = fileReader.result;
      this.newFile = (<string>hey).split(',', 1);
    }
    fileReader.readAsText(this.fileToUpload);
  }

  openModal(template: TemplateRef<any>) {
    this.modalService.open(template, { size: 'lg', centered: true, backdrop: 'static' });
  }


}
