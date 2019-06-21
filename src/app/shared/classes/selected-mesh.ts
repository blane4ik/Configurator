import { Mesh, Geometry, Material } from 'three';
    // Класс, расширяющий класс Mesh, задающий свойства при выделении объекта

export class SelectedMesh extends  Mesh {


    constructor(public geometry: Geometry, public material: Material) {
        super();
    }

// tslint:disable-next-line: variable-name
    public isSelected = false;

    public toggleSelection() {
        this.isSelected = !this.isSelected;

        if (this.isSelected && this.material.length === undefined) {
            this.material.opacity = 0.5;
            this.material.transparent = true;
        } else if (this.isSelected && this.material.length !== undefined) {
// tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.material.length; i++) {
                this.material[i].opacity = 0.5;
                this.material[i].transparent = true;
            }
        } else if (!this.isSelected && this.material.length !== undefined) {
// tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.material.length; i++) {
                this.material[i].opacity = 1;
                this.material[i].transparent = false;
            }
        } else {
            this.material.opacity = 1;
            this.material.transparent = false;
        }
    }

}
