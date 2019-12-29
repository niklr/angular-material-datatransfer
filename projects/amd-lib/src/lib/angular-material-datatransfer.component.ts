import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { CustomEventType, CustomEventTypeExtensions } from './enums/custom-event-type.enum';
import { HostDirective } from './directives/host.directive';
import { MainComponent } from './components/main.component';
import { DatatransferFacade } from './facades/datatransfer.facade';
import { DatatransferFacadeFactory } from './factories/datatransfer-facade.factory';
import { ConfigService } from './services/config.service';
import { PaginationService } from './services/pagination.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'angular-material-datatransfer-lib',
  templateUrl: './angular-material-datatransfer.component.html'
})
export class AngularMaterialDatatransferComponent implements OnInit {

  @ViewChild(HostDirective, { static: true }) amdHost: HostDirective;

  private datatransferFacade: DatatransferFacade;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private datatransferFacadeFactory: DatatransferFacadeFactory,
              private configService: ConfigService,
              private paginationService: PaginationService) {
  }

  ngOnInit() {
    document.dispatchEvent(new Event(CustomEventTypeExtensions.toString(CustomEventType.INIT)));
  }

  public create(config: any): void {
    this.setConfig(config);
  }

  public setConfig(config: any): void {
    this.configService.load(config);
    this.paginationService.setRppOptions(ConfigService.settings.core.paginationRppOptions);
    this.datatransferFacade = this.datatransferFacadeFactory.createDatatransferFacade();

    const viewContainerRef = this.amdHost.viewContainerRef;
    viewContainerRef.clear();

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MainComponent);
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const componentRefInstance = componentRef.instance as MainComponent;
    componentRefInstance.datatransferFacade = this.datatransferFacade;
  }

  public download(filename: string, url: string, size: number): void {
    this.datatransferFacade.download(filename, url, size);
  }
}
