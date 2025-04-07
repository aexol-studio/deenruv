import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { hostExternalFrame } from "@deenruv/admin-ui/core";

@NgModule({
  imports: [
    RouterModule.forChild([
      hostExternalFrame({
        path: "",
        breadcrumbLabel: "Test",
        extensionUrl: "./assets/external-app/index.html",
        openInNewTab: false,
      }),
    ]),
  ],
})
export class ExternalUiExtensionModule {}
