//
//  CollectionViewCell.swift
//  NBCHackathon
//
//  Created by Lucas Farah on 3/6/16.
//  Copyright © 2016 Lucas Farah. All rights reserved.
//

import UIKit

class GalleryCell: UICollectionViewCell
{
  
  
  @IBOutlet var titleLabel : UILabel?
  
  
  required init(coder aDecoder: NSCoder!)
  {
    super.init(coder: aDecoder)!
    
  }
}